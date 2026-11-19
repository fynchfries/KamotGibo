import Foundation
import AVFoundation
import AppKit
import CoreText
import CoreImage
import CoreVideo
import ImageIO
import Metal

struct Cue: Decodable { let start: Double; let end: Double; let checkAt: Double; let kicker: String; let title: String }
func require(_ condition: Bool, _ message: String) throws {
    if !condition { throw NSError(domain:"FreeDemoRender",code:1,userInfo:[NSLocalizedDescriptionKey:message]) }
}
func ease(_ value: Double) -> Double {
    let t=min(1,max(0,value)); return t*t*t*(t*(t*6-15)+10)
}
func opacity(_ cue: Cue, _ time: Double) -> Double {
    if time<cue.start || time>=cue.end {return 0}
    return min(ease((time-cue.start)/0.32),ease((cue.end-time)/0.22))
}
func textImage(_ lines: [(String,CGFloat,CGFloat,NSFont,CGFloat)]) throws -> CIImage {
    guard let c=CGContext(data:nil,width:1728,height:96,bitsPerComponent:8,bytesPerRow:1728*4,space:CGColorSpace(name:CGColorSpace.sRGB)!,bitmapInfo:CGImageAlphaInfo.premultipliedLast.rawValue) else {throw NSError(domain:"FreeDemoRender",code:2,userInfo:[NSLocalizedDescriptionKey:"Cannot allocate title canvas"])}
    for (text,x,y,font,alpha) in lines {
        let attributes=[kCTFontAttributeName:CTFontCreateWithName(font.fontName as CFString,font.pointSize,nil),kCTForegroundColorAttributeName:CGColor(red:0.95,green:0.97,blue:0.96,alpha:alpha)] as CFDictionary
        let line=CTLineCreateWithAttributedString(CFAttributedStringCreate(nil,text as CFString,attributes)!)
        let width=CTLineGetTypographicBounds(line,nil,nil,nil)
        try require(x+width<1728,"Chapter text exceeds its safe canvas: \(text)")
        c.textPosition=CGPoint(x:x,y:y); CTLineDraw(line,c)
    }
    guard let image=c.makeImage() else {throw NSError(domain:"FreeDemoRender",code:3,userInfo:[NSLocalizedDescriptionKey:"Cannot rasterize chapter text"])}
    return CIImage(cgImage:image)
}
func save(_ image: CIImage, _ context: CIContext, _ path: String) throws {
    guard let cg=context.createCGImage(image,from:CGRect(x:0,y:0,width:1920,height:1080)),let destination=CGImageDestinationCreateWithURL(URL(fileURLWithPath:path) as CFURL,"public.jpeg" as CFString,1,nil) else {throw NSError(domain:"FreeDemoRender",code:4,userInfo:[NSLocalizedDescriptionKey:"Cannot create preview"])}
    CGImageDestinationAddImage(destination,cg,[kCGImageDestinationLossyCompressionQuality:0.94] as CFDictionary)
    try require(CGImageDestinationFinalize(destination),"Cannot save preview")
}

@main struct Render {
    static func main() async {
        do {
            try require(CommandLine.arguments.count==4 || CommandLine.arguments.count==5,"Usage: render source.mp4 cues.json output.mp4 [--preview]")
            let source=URL(fileURLWithPath:CommandLine.arguments[1]).standardizedFileURL
            let outputURL=URL(fileURLWithPath:CommandLine.arguments[3]).standardizedFileURL
            try require(source != outputURL,"Refusing to replace the original video")
            let cues=try JSONDecoder().decode([Cue].self,from:Data(contentsOf:URL(fileURLWithPath:CommandLine.arguments[2])))
            try require(cues.count==9 && cues.first!.start>=0 && cues.last!.end==60,"Unexpected chapter timeline")
            for cue in cues {
                try require(cue.start<cue.checkAt && cue.checkAt<cue.end && cue.end-cue.start>1.5,"Chapter has no readable hold")
                try require(opacity(cue,cue.start)==0 && opacity(cue,cue.start+0.4)>0.999,"Broken chapter easing")
            }
            for i in 1..<cues.count {try require(cues[i-1].end<cues[i].start,"Overlapping chapter text")}
            try require(abs(ease(0))+abs(ease(1)-1)<0.00001 && ease(0.001)<0.00001,"Easing endpoints are not smooth")
            try require(opacity(cues.last!,58)>0.999,"Final headline is not settled at 58 seconds")
            let videoRect=CGRect(x:96,y:108,width:1728,height:972)
            let railRect=CGRect(x:96,y:0,width:1728,height:96)
            try require(!videoRect.intersects(railRect) && videoRect.maxY==1080 && videoRect.width/videoRect.height==16.0/9,"Typography can cover or distort UI")
            let asset=AVURLAsset(url:source)
            let duration=try await asset.load(.duration).seconds
            let tracks=try await asset.loadTracks(withMediaType:.video)
            try require(abs(duration-60)<0.0001 && tracks.count==1,"Source is not the verified one-minute film")
            guard let device=MTLCreateSystemDefaultDevice() else {throw NSError(domain:"FreeDemoRender",code:5,userInfo:[NSLocalizedDescriptionKey:"Metal unavailable"])}
            let colorSpace=CGColorSpace(name:CGColorSpace.sRGB)!
            let context=CIContext(mtlDevice:device,options:[.cacheIntermediates:false,.workingColorSpace:colorSpace])
            let bounds=CGRect(x:0,y:0,width:1920,height:1080)
            let background=CIImage(color:CIColor(red:0.027,green:0.085,blue:0.098)).cropped(to:bounds)
            let titleFont=NSFont(name:"Manrope",size:30) ?? NSFont.systemFont(ofSize:30,weight:.semibold)
            let kickerFont=NSFont(name:"Manrope",size:11) ?? NSFont.systemFont(ofSize:11,weight:.semibold)
            let smallFont=NSFont(name:"Manrope",size:13) ?? NSFont.systemFont(ofSize:13,weight:.regular)
            let titles=try cues.map {try textImage([($0.kicker,20,67,kickerFont,0.65),($0.title,20,25,titleFont,1)])}
            let notice=try textImage([("Frontend demo · Sample data",1360,53,smallFont,0.65),("No real reservations or online payments",1360,29,smallFont,0.65)])
            let badgeNotice=try textImage([("Frontend demo · Sample data",1360,53,smallFont,0.65),("Platform badge, not a formal qualification",1360,29,smallFont,0.65)])
            let generator=AVAssetImageGenerator(asset:asset)
            generator.appliesPreferredTrackTransform=true
            generator.requestedTimeToleranceBefore = .zero
            generator.requestedTimeToleranceAfter = .zero
            let cleanHome=try await generator.image(at:CMTime(value:1758,timescale:30))
            let frozenHome=CIImage(cgImage:cleanHome.image)
            func compose(_ sourceImage: CIImage, _ time: Double) -> CIImage {
                let t=min(time,58)
                let base=time>=58 ? frozenHome : sourceImage
                var image=base.transformed(by:CGAffineTransform(a:0.9,b:0,c:0,d:0.9,tx:96,ty:108)).composited(over:background)
                let footer=(39<=t && t<50.2) ? badgeNotice : notice
                image=footer.transformed(by:CGAffineTransform(translationX:96,y:0)).composited(over:image)
                if let i=cues.firstIndex(where:{$0.start<=t && t<$0.end}) {
                    let alpha=opacity(cues[i],t)
                    let rise=12*(1-ease((t-cues[i].start)/0.32))
                    let layer=titles[i].transformed(by:CGAffineTransform(translationX:96,y:-rise)).applyingFilter("CIColorMatrix",parameters:["inputAVector":CIVector(x:0,y:0,z:0,w:alpha)])
                    image=layer.composited(over:image)
                    let accent=CIImage(color:CIColor(red:0.68,green:0.29,blue:0.20,alpha:alpha)).cropped(to:CGRect(x:96,y:24-rise,width:4,height:52))
                    image=accent.composited(over:image)
                }
                return image.cropped(to:bounds)
            }
            print("PASS: chapter timing/easing, non-overlapping UI/title geometry and settled final headline; native title font: \(titleFont.fontName)")
            if CommandLine.arguments.contains("--preview") {
                for cue in cues {
                    let result=try await generator.image(at:CMTime(value:Int64((cue.checkAt*30).rounded()),timescale:30))
                    let file=String(format:"/private/tmp/kamotgibo-free-demo/previews/preview-%05.2f.jpg",cue.checkAt)
                    try save(compose(CIImage(cgImage:result.image),cue.checkAt),context,file)
                    print("Preview: \(file)")
                }
                return
            }
            try require(!FileManager.default.fileExists(atPath:outputURL.path),"Refusing to overwrite an existing output")
            let reader=try AVAssetReader(asset:asset)
            let decoded=AVAssetReaderTrackOutput(track:tracks[0],outputSettings:[kCVPixelBufferPixelFormatTypeKey as String:kCVPixelFormatType_32BGRA])
            decoded.alwaysCopiesSampleData=false
            try require(reader.canAdd(decoded),"Cannot add source decoder"); reader.add(decoded)
            let writer=try AVAssetWriter(outputURL:outputURL,fileType:.mp4)
            writer.shouldOptimizeForNetworkUse=true
            let input=AVAssetWriterInput(mediaType:.video,outputSettings:[AVVideoCodecKey:AVVideoCodecType.h264,AVVideoWidthKey:1920,AVVideoHeightKey:1080,AVVideoCompressionPropertiesKey:[AVVideoAverageBitRateKey:10_000_000,AVVideoExpectedSourceFrameRateKey:30,AVVideoMaxKeyFrameIntervalKey:60,AVVideoProfileLevelKey:AVVideoProfileLevelH264HighAutoLevel]])
            input.expectsMediaDataInRealTime=false
            let adaptor=AVAssetWriterInputPixelBufferAdaptor(assetWriterInput:input,sourcePixelBufferAttributes:[kCVPixelBufferPixelFormatTypeKey as String:kCVPixelFormatType_32BGRA,kCVPixelBufferWidthKey as String:1920,kCVPixelBufferHeightKey as String:1080,kCVPixelBufferMetalCompatibilityKey as String:true,kCVPixelBufferIOSurfacePropertiesKey as String:[:]])
            try require(writer.canAdd(input),"Cannot add output encoder"); writer.add(input)
            try require(writer.startWriting(),writer.error?.localizedDescription ?? "Cannot start encoder")
            writer.startSession(atSourceTime:.zero)
            try require(reader.startReading(),reader.error?.localizedDescription ?? "Cannot start decoder")
            guard let pool=adaptor.pixelBufferPool else {throw NSError(domain:"FreeDemoRender",code:6,userInfo:[NSLocalizedDescriptionKey:"No render-target pool"])}
            var count=0
            while let sample=decoded.copyNextSampleBuffer() {
                while !input.isReadyForMoreMediaData {try require(writer.status == .writing,writer.error?.localizedDescription ?? "Encoder stopped"); usleep(1000)}
                try autoreleasepool {
                    let time=Double(count)/30
                    try require(abs(CMSampleBufferGetPresentationTimeStamp(sample).seconds-time)<0.0001,"Source frame timing changed")
                    guard let sourcePixels=CMSampleBufferGetImageBuffer(sample) else {throw NSError(domain:"FreeDemoRender",code:7,userInfo:[NSLocalizedDescriptionKey:"Missing source frame"])}
                    var target: CVPixelBuffer?
                    try require(CVPixelBufferPoolCreatePixelBuffer(nil,pool,&target)==kCVReturnSuccess,"Cannot allocate output frame")
                    context.render(compose(CIImage(cvPixelBuffer:sourcePixels),time),to:target!,bounds:bounds,colorSpace:colorSpace)
                    try require(adaptor.append(target!,withPresentationTime:CMTime(value:Int64(count),timescale:30)),writer.error?.localizedDescription ?? "Cannot append output frame")
                }
                count+=1
                if count%300==0 {print("Rendered \(count)/1800 frames");fflush(stdout)}
            }
            try require(reader.status == .completed && count==1800,reader.error?.localizedDescription ?? "Source did not decode all 1,800 frames")
            writer.endSession(atSourceTime:CMTime(value:1800,timescale:30))
            input.markAsFinished()
            await writer.finishWriting()
            try require(writer.status == .completed,writer.error?.localizedDescription ?? "Cannot finish MP4")
            print("PASS: 1,800 frames encoded; one video input, no audio; original source retained")
        } catch {
            fputs("FAIL: \(error.localizedDescription)\n",stderr)
            exit(1)
        }
    }
}
