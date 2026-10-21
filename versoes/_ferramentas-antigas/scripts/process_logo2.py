from PIL import Image
import os

def convert_logo():
    input_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/midias/logo-leo.webp'
    output_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/midias/logo-leo-white.png'
    
    if not os.path.exists(input_path):
        print("Input path does not exist.")
        return

    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    pixels = img.load()
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            luminance = int(0.299*r + 0.587*g + 0.114*b)
            
            new_a = int((255 - luminance) * (a / 255.0))
            
            # Threshold to prevent faint boxes from off-white backgrounds
            if new_a < 15:
                new_a = 0
                
            pixels[x, y] = (255, 255, 255, new_a)

    img.save(output_path, "PNG")
    print("Logo converted successfully with Pillow!")

if __name__ == '__main__':
    convert_logo()
