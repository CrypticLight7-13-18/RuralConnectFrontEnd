
import os
import random
import cairosvg

# Output directory
output_dir = "generated_images"
os.makedirs(output_dir, exist_ok=True)

# Load template SVG
with open("pill.svg", "r") as f:
    pill_template = f.read()

def random_color():
    return "#{:06x}".format(random.randint(0, 0xFFFFFF))

def apply_colors(svg, bg_color, fg_color):
    svg = svg.replace('id="bg" width="100%" height="100%" fill="#e0fbfc"',
                      f'id="bg" width="100%" height="100%" fill="{bg_color}"')
    svg = svg.replace('fill="#000000"', f'fill="{fg_color}"')
    return svg

def generate_images():
    for i in range(1, 101):
        bg = random_color()
        fg = random_color()

        padded_index = str(i).zfill(2)
        svg_path = os.path.join(output_dir, f"image0{padded_index}.svg")
        png_path = os.path.join(output_dir, f"image0{padded_index}.png")

        svg_code = apply_colors(pill_template, bg, fg)

        with open(svg_path, "w") as f:
            f.write(svg_code)

        cairosvg.svg2png(url=svg_path, write_to=png_path)
        print(f"Generated: {png_path}")

if __name__ == "__main__":
    generate_images()
