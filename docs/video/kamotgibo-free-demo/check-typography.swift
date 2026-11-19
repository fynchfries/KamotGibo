import Foundation
import AVFoundation
import CoreGraphics
import ImageIO
import Vision

struct Cue: Decodable { let start: Double; let end: Double; let checkAt: Double; let kicker: String; let title: String }
func require(_ condition: Bool, _ message: String) throws {
    if !condition { throw NSError(domain:"FreeDemoCheck",code:1,userInfo:[NSLocalizedDescriptionKey:message]) }
}
func normalized(_ text: String) -> String {
    text.lowercased().unicodeScalars.filter { CharacterSet.alphanumerics.contains($0) }.map(String.init).joined()
}
func thumbnail(_ image: CGImage) -> [UInt8] {
    var pixels=[UInt8](repeating:0,count:64*36*4)
    pixels.withUnsafeMutableBytes { bytes in
        let c=CGContext(data:bytes.baseAddress,width:64,height:36,bitsPerComponent:8,bytesPerRow:64*4,space:CGColorSpaceCreateDeviceRGB(),bitmapInfo:CGImageAlphaInfo.premultipliedLast.rawValue)!
        c.interpolationQuality = .low
        c.draw(image,in:CGRect(x:0,y:0,width:64,height:36))
    }
    return pixels
}
@main struct Check {
    static func main() async {
        do {
            try require(CommandLine.arguments.count==4,"Usage: check-typography video.mp4 cues.json preview-directory")
            let asset=AVURLAsset(url:URL(fileURLWithPath:CommandLine.arguments[1]))
            let cues=try JSONDecoder().decode([Cue].self,from:Data(contentsOf:URL(fileURLWithPath:CommandLine.arguments[2])))
            let directory=URL(fileURLWithPath:CommandLine.arguments[3])
            try FileManager.default.createDirectory(at:directory,withIntermediateDirectories:true)
            let generator=AVAssetImageGenerator(asset:asset)
            generator.appliesPreferredTrackTransform=true
            generator.requestedTimeToleranceBefore = .zero
            generator.requestedTimeToleranceAfter = .zero
            for cue in cues {
                let result=try await generator.image(at:CMTime(value:Int64((cue.checkAt*30).rounded()),timescale:30))
                try require(result.image.width==1920 && result.image.height==1080,"Unexpected frame dimensions")
                guard let rail=result.image.cropping(to:CGRect(x:0,y:972,width:1920,height:108)) else {throw NSError(domain:"FreeDemoCheck",code:2,userInfo:[NSLocalizedDescriptionKey:"Missing bottom title strip"])}
                let request=VNRecognizeTextRequest()
                request.recognitionLevel = .accurate
                request.recognitionLanguages = ["en-US"]
                request.usesLanguageCorrection=false
                try VNImageRequestHandler(cgImage:rail).perform([request])
                let observed=(request.results ?? []).compactMap { $0.topCandidates(1).first?.string }.joined(separator:" ")
                try require(normalized(observed).contains(normalized(cue.title)),"Missing chapter title at \(cue.checkAt)s: expected [\(cue.title)], observed [\(observed)]")
                let file=directory.appendingPathComponent(String(format:"free-%05.2f.jpg",cue.checkAt))
                let destination=CGImageDestinationCreateWithURL(file as CFURL,"public.jpeg" as CFString,1,nil)!
                CGImageDestinationAddImage(destination,result.image,[kCGImageDestinationLossyCompressionQuality:0.94] as CFDictionary)
                try require(CGImageDestinationFinalize(destination),"Cannot save decoded review frame")
                print("PASS: title OCR at \(cue.checkAt)s — \(cue.title)")
            }
            var levels: [Double]=[]
            for frame in [9,14,24] {
                let result=try await generator.image(at:CMTime(value:Int64(frame),timescale:30))
                let rail=result.image.cropping(to:CGRect(x:96,y:972,width:1000,height:108))!
                let pixels=thumbnail(rail)
                levels.append(pixels.enumerated().reduce(0.0) { $0+($1.offset%4==3 ? 0 : Double($1.element)) }/Double(64*36*3))
            }
            try require(levels[1]>levels[0]+0.5 && levels[2]>levels[1]+0.5,"Exported chapter text does not animate from entry through midpoint to settled hold: \(levels)")
            print("PASS: decoded title-entry animation progresses through three actual frames: \(levels)")
            var first: [UInt8]?
            for frame in [1740,1755,1770,1799] {
                let result=try await generator.image(at:CMTime(value:Int64(frame),timescale:30))
                let pixels=thumbnail(result.image)
                if let reference=first {
                    let difference=zip(reference,pixels).reduce(0.0) { $0+Double(abs(Int($1.0)-Int($1.1))) }/Double(pixels.count)
                    try require(difference<0.5,"Final composition moves at frame \(frame): mean thumbnail difference \(difference)")
                    print(String(format:"PASS: final hold frame %d, mean decoded difference %.4f",frame,difference))
                } else { first=pixels }
            }
            print("PASS: all \(cues.count) exact chapter titles present; final two-second composition is stable")
        } catch {
            fputs("FAIL: \(error.localizedDescription)\n",stderr)
            exit(1)
        }
    }
}
