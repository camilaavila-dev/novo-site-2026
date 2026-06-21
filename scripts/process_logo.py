from PIL import Image

def convert_logo():
    input_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/midias/logo-leo.webp'
    output_path = 'c:/Users/Camila Ávila/Desktop/Projetos/LEONARDO/novo-site-2026/midias/logo-leo-white.png'
    
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    pixels = img.load()
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            # Calculate luminance
            luminance = int(0.299*r + 0.587*g + 0.114*b)
            
            # If the original image had a transparent background to begin with, 
            # we should respect its original alpha but invert the color.
            # But usually it's a solid white background.
            # We will set color to pure white, and alpha to (255 - luminance) * (original_a / 255)
            
            new_a = int((255 - luminance) * (a / 255.0))
            
            pixels[x, y] = (255, 255, 255, new_a)

    img.save(output_path, "PNG")
    print("Logo converted successfully!")

if __name__ == '__main__':
    convert_logo()
