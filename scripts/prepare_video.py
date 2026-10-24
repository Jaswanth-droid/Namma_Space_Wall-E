"""
Prepare Video Capture for 3D Gaussian Splatting
Techfest IIT Bombay - Namma Space
"""

import os
import sys
import subprocess
import argparse

def extract_frames(video_path, output_dir, fps=2):
    if not os.path.exists(video_path):
        print(f"Error: Video file not found at {video_path}")
        return False
        
    os.makedirs(output_dir, exist_ok=True)
    
    cmd = [
        "ffmpeg",
        "-i", video_path,
        "-qscale:v", "2",
        "-r", str(fps),
        os.path.join(output_dir, "frame_%04d.jpg")
    ]
    
    print(f"Extracting frames from '{video_path}' at {fps} fps to '{output_dir}'...")
    try:
        subprocess.run(cmd, check=True)
        count = len(os.listdir(output_dir))
        print(f"Success: Extracted {count} frames.")
        return True
    except FileNotFoundError:
        print("FFmpeg is not installed or not in PATH. You can directly upload the MP4 video to Colab.")
        return False
    except Exception as e:
        print(f"Extraction failed: {e}")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract video frames for 3DGS pipeline")
    parser.add_argument("--video", type=str, required=True, help="Path to smartphone capture video (.mp4/.mov)")
    parser.add_argument("--out", type=str, default="frames", help="Output directory for extracted frames")
    parser.add_argument("--fps", type=int, default=2, help="Frames per second to sample (default: 2)")
    args = parser.parse_args()
    
    extract_frames(args.video, args.out, args.fps)
