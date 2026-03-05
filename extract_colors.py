from PIL import Image
from collections import Counter
import sys

def get_dominant_colors(image_path, num_colors=5):
    try:
        image = Image.open(image_path)
        image = image.convert('RGB')
        
        # Resize to speed up processing
        image.thumbnail((100, 100))
        
        pixels = list(image.getdata())
        counts = Counter(pixels)
        
        print(f"Colors for {image_path}:")
        for color, count in counts.most_common(num_colors):
            hex_color = '#{:02x}{:02x}{:02x}'.format(color[0], color[1], color[2])
            print(f"{hex_color} (count: {count})")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        get_dominant_colors(sys.argv[1])
    else:
        print("Usage: python extract_colors.py <image_path>")
