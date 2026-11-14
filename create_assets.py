import os
import math
from PIL import Image, ImageDraw, ImageFont

os.makedirs('images', exist_ok=True)
os.makedirs('videos', exist_ok=True)

def create_gradient(width, height, color1, color2, vertical=True):
    base = Image.new('RGB', (width, height), color1)
    top = Image.new('RGB', (width, height), color2)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        for x in range(width):
            if vertical:
                factor = y / height
            else:
                factor = (x + y) / (width + height)
            mask_data.append(int(255 * factor))
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def draw_heart(draw, center, size, color):
    cx, cy = center
    # Parametric heart shape
    points = []
    for t in range(0, 360, 5):
        rad = math.radians(t)
        # Standard heart curve
        x = 16 * (math.sin(rad) ** 3)
        y = -(13 * math.cos(rad) - 5 * math.cos(2*rad) - 2 * math.cos(3*rad) - math.cos(4*rad))
        px = cx + x * (size / 16)
        py = cy + y * (size / 16)
        points.append((px, py))
    draw.polygon(points, fill=color)

def draw_star(draw, center, size, color):
    cx, cy = center
    points = []
    for i in range(10):
        r = size if i % 2 == 0 else size * 0.4
        angle = i * math.pi / 5 - math.pi / 2
        px = cx + r * math.cos(angle)
        py = cy + r * math.sin(angle)
        points.append((px, py))
    draw.polygon(points, fill=color)

def draw_sparkle(draw, center, size, color):
    cx, cy = center
    # 4-pointed sparkle
    points = [
        (cx, cy - size),
        (cx + size * 0.25, cy - size * 0.25),
        (cx + size, cy),
        (cx + size * 0.25, cy + size * 0.25),
        (cx, cy + size),
        (cx - size * 0.25, cy + size * 0.25),
        (cx - size, cy),
        (cx - size * 0.25, cy - size * 0.25)
    ]
    draw.polygon(points, fill=color)

# 1. GENERATE FRIENDSHIP ILLUSTRATION (boy and girl best friends)
def generate_friendship_illustration():
    w, h = 800, 800
    img = create_gradient(w, h, (255, 236, 245), (225, 235, 255), vertical=False)
    draw = ImageDraw.Draw(img)

    # Background decorative circles & glow
    draw.ellipse((100, 100, 700, 700), fill=(255, 255, 255, 180), outline=(255, 182, 193), width=4)
    draw.ellipse((120, 120, 680, 680), fill=(255, 250, 252))

    # Floating balloons
    balloon_colors = [(255, 107, 139), (161, 140, 209), (79, 172, 254), (254, 225, 64), (168, 237, 234)]
    balloons = [(180, 180, 36), (620, 190, 38), (150, 250, 30), (660, 260, 32), (400, 130, 42)]
    for (bx, by, br), col in zip(balloons, balloon_colors):
        draw.ellipse((bx - br, by - br * 1.2, bx + br, by + br * 1.2), fill=col)
        # string
        draw.line([(bx, by + br * 1.2), (bx - 5, by + br * 1.2 + 60)], fill=(180, 180, 200), width=2)
        draw_sparkle(draw, (bx + br * 0.4, by - br * 0.4), 8, (255, 255, 255))

    # Sparkles & hearts in background
    for sp in [(250, 220), (550, 210), (220, 420), (590, 410), (380, 200), (420, 220)]:
        draw_sparkle(draw, sp, 14, (255, 200, 80))
    for ht in [(200, 320), (600, 330), (300, 150), (500, 160), (400, 260)]:
        draw_heart(draw, ht, 12, (255, 130, 160))

    # Ground hill / bench
    draw.ellipse((100, 560, 700, 900), fill=(230, 245, 240))
    draw.line([(250, 580), (550, 580)], fill=(140, 110, 95), width=8) # bench seat
    draw.line([(280, 580), (280, 670)], fill=(110, 85, 75), width=6)
    draw.line([(520, 580), (520, 670)], fill=(110, 85, 75), width=6)

    # BOY (Left Friend)
    # Body (hoodie/shirt)
    draw.rectangle([300, 440, 370, 580], fill=(79, 172, 254)) # Blue hoodie
    # Legs
    draw.rectangle([305, 580, 332, 660], fill=(70, 90, 120))
    draw.rectangle([338, 580, 365, 660], fill=(70, 90, 120))
    # Shoes
    draw.ellipse([300, 650, 335, 670], fill=(255, 255, 255))
    draw.ellipse([335, 650, 370, 670], fill=(255, 255, 255))
    # Head & Face
    draw.ellipse([305, 330, 365, 395], fill=(255, 224, 189)) # Face skin
    # Hair
    draw.ellipse([300, 315, 370, 360], fill=(75, 50, 35))
    draw.rectangle([300, 330, 315, 355], fill=(75, 50, 35))
    # Eyes & Smile
    draw.ellipse([325, 355, 330, 362], fill=(50, 40, 30))
    draw.ellipse([345, 355, 350, 362], fill=(50, 40, 30))
    draw.arc([328, 365, 348, 380], 0, 180, fill=(200, 80, 80), width=2)
    # Arm high-fiving or around
    draw.line([(365, 450), (400, 410)], fill=(79, 172, 254), width=18)
    draw.ellipse([395, 400, 415, 420], fill=(255, 224, 189))

    # GIRL (Right Friend)
    # Body (sweater/dress)
    draw.rectangle([430, 440, 500, 580], fill=(255, 140, 175)) # Pink sweater
    # Skirt/Pants
    draw.rectangle([435, 580, 462, 660], fill=(240, 240, 245))
    draw.rectangle([468, 580, 495, 660], fill=(240, 240, 245))
    # Shoes
    draw.ellipse([430, 650, 465, 670], fill=(255, 107, 139))
    draw.ellipse([465, 650, 500, 670], fill=(255, 107, 139))
    # Hair long
    draw.ellipse([420, 315, 510, 440], fill=(110, 65, 40)) # long hair
    # Head & Face
    draw.ellipse([435, 330, 495, 395], fill=(255, 224, 189))
    # Bangs
    draw.ellipse([435, 320, 495, 350], fill=(110, 65, 40))
    # Eyes & Cheerful Smile & Blush
    draw.ellipse([450, 355, 455, 362], fill=(50, 40, 30))
    draw.ellipse([470, 355, 475, 362], fill=(50, 40, 30))
    draw.ellipse([442, 365, 452, 372], fill=(255, 160, 170)) # blush
    draw.ellipse([473, 365, 483, 372], fill=(255, 160, 170)) # blush
    draw.arc([453, 365, 473, 380], 0, 180, fill=(200, 80, 80), width=2)
    # Arm reaching to high-five
    draw.line([(435, 450), (405, 410)], fill=(255, 140, 175), width=18)
    draw.ellipse([395, 400, 415, 420], fill=(255, 224, 189))

    # Shared heart between their hands
    draw_heart(draw, (405, 385), 18, (255, 75, 110))
    draw_sparkle(draw, (405, 355), 10, (255, 225, 75))

    # Banner ribbon at bottom: "Best Friends Forever ♡"
    draw.rounded_rectangle([200, 690, 600, 750], radius=30, fill=(255, 255, 255), outline=(255, 150, 180), width=3)
    try:
        font = ImageFont.truetype("arial.ttf", 26)
    except:
        font = ImageFont.load_default()
    draw.text((250, 705), "Best Friends Forever ♡", fill=(230, 60, 110), font=font)

    img.save("images/friendship.png", "PNG")
    print("Generated images/friendship.png")

generate_friendship_illustration()

# 2. GENERATE 10 GALLERY PHOTOS
photos = [
    {
        "filename": "photo1.jpg",
        "title": "A Beautiful Beginning",
        "quote": "Some people make ordinary moments feel extraordinary.",
        "colors": ((175, 220, 255), (255, 210, 220)),
        "icon": "sunrise"
    },
    {
        "filename": "photo2.jpg",
        "title": "Endless Laughter",
        "quote": "A little madness, endless laughter and memories worth keeping forever.",
        "colors": ((255, 240, 180), (255, 185, 210)),
        "icon": "smile"
    },
    {
        "filename": "photo3.jpg",
        "title": "Little Adventures",
        "quote": "Different personalities, endless conversations, one unforgettable bond.",
        "colors": ((190, 245, 220), (160, 210, 255)),
        "icon": "compass"
    },
    {
        "filename": "photo4.jpg",
        "title": "Random Conversations",
        "quote": "Not every special bond needs a definition; some are simply felt.",
        "colors": ((215, 195, 255), (150, 180, 240)),
        "icon": "chat"
    },
    {
        "filename": "photo5.jpg",
        "title": "Picture Perfect",
        "quote": "The best memories are made without even planning them.",
        "colors": ((255, 205, 190), (255, 175, 205)),
        "icon": "camera"
    },
    {
        "filename": "photo6.jpg",
        "title": "Silly Fights",
        "quote": "Behind every silly fight, there is a little care and a lot of love.",
        "colors": ((255, 235, 170), (255, 180, 170)),
        "icon": "tease"
    },
    {
        "filename": "photo7.jpg",
        "title": "Unexpected Memories",
        "quote": "Some unexpected connections become our favourite chapters.",
        "colors": ((225, 205, 255), (185, 245, 230)),
        "icon": "umbrella"
    },
    {
        "filename": "photo8.jpg",
        "title": "Little Pieces of Happiness",
        "quote": "Not just photographs, but little pieces of happiness captured forever.",
        "colors": ((255, 195, 225), (255, 235, 195)),
        "icon": "icecream"
    },
    {
        "filename": "photo9.jpg",
        "title": "Forever Memories",
        "quote": "Years may pass, but these little moments will always make us smile.",
        "colors": ((255, 180, 150), (200, 160, 230)),
        "icon": "sunset"
    },
    {
        "filename": "photo10.jpg",
        "title": "Our Little Story",
        "quote": "If memories could speak, ours would never run out of stories.",
        "colors": ((180, 170, 240), (255, 205, 235)),
        "icon": "book"
    }
]

def generate_gallery_photos():
    w, h = 900, 700
    for idx, p in enumerate(photos, 1):
        img = create_gradient(w, h, p["colors"][0], p["colors"][1], vertical=False)
        draw = ImageDraw.Draw(img)

        # Draw frame / polaroid effect
        draw.rounded_rectangle([30, 30, w - 30, h - 30], radius=24, outline=(255, 255, 255), width=6)
        draw.rounded_rectangle([45, 45, w - 45, h - 45], radius=18, outline=(255, 255, 255, 120), width=2)

        # Ambient floating sparkles & hearts
        for s in [(100, 100), (800, 120), (120, 600), (780, 580), (450, 140)]:
            draw_sparkle(draw, s, 16, (255, 255, 255))
        for ht in [(200, 180), (700, 200), (160, 520), (740, 500)]:
            draw_heart(draw, ht, 14, (255, 120, 150))

        # Center illustration badge
        cx, cy = w // 2, h // 2 - 40
        draw.ellipse([cx - 140, cy - 140, cx + 140, cy + 140], fill=(255, 255, 255, 220), outline=(255, 255, 255), width=6)

        # Draw specific icon theme
        icon = p["icon"]
        if icon == "sunrise":
            draw.ellipse([cx - 50, cy - 20, cx + 50, cy + 80], fill=(255, 200, 50))
            draw.line([(cx - 90, cy + 30), (cx + 90, cy + 30)], fill=(79, 172, 254), width=6)
            draw_sparkle(draw, (cx, cy - 50), 20, (255, 160, 30))
        elif icon == "smile":
            draw.ellipse([cx - 60, cy - 60, cx + 60, cy + 60], fill=(255, 225, 75))
            draw.ellipse([cx - 25, cy - 20, cx - 15, cy - 5], fill=(70, 50, 30))
            draw.ellipse([cx + 15, cy - 20, cx + 25, cy - 5], fill=(70, 50, 30))
            draw.arc([cx - 35, cy - 10, cx + 35, cy + 40], 0, 180, fill=(200, 50, 50), width=6)
        elif icon == "compass":
            draw.ellipse([cx - 60, cy - 60, cx + 60, cy + 60], fill=(255, 255, 255), outline=(79, 172, 254), width=5)
            draw.polygon([(cx, cy - 50), (cx - 15, cy), (cx, cy + 10)], fill=(255, 90, 120))
            draw.polygon([(cx, cy + 50), (cx + 15, cy), (cx, cy - 10)], fill=(79, 172, 254))
        elif icon == "chat":
            draw.rounded_rectangle([cx - 70, cy - 55, cx + 10, cy + 5], radius=15, fill=(161, 140, 209))
            draw.rounded_rectangle([cx - 10, cy - 20, cx + 70, cy + 40], radius=15, fill=(255, 150, 180))
            draw_heart(draw, (cx - 30, cy - 25), 10, (255, 255, 255))
            draw_sparkle(draw, (cx + 30, cy + 10), 10, (255, 255, 255))
        elif icon == "camera":
            draw.rounded_rectangle([cx - 65, cy - 45, cx + 65, cy + 45], radius=16, fill=(70, 75, 90))
            draw.ellipse([cx - 32, cy - 25, cx + 32, cy + 39], fill=(255, 255, 255), outline=(255, 107, 139), width=5)
            draw.ellipse([cx - 18, cy - 11, cx + 18, cy + 25], fill=(70, 180, 240))
            draw.ellipse([cx + 35, cy - 30, cx + 45, cy - 20], fill=(255, 225, 75))
        elif icon == "tease":
            draw_heart(draw, (cx - 35, cy - 10), 22, (255, 107, 139))
            draw_heart(draw, (cx + 35, cy - 10), 22, (79, 172, 254))
            draw_sparkle(draw, (cx, cy - 10), 16, (255, 220, 60))
        elif icon == "umbrella":
            draw.pieslice([cx - 60, cy - 50, cx + 60, cy + 70], 180, 360, fill=(161, 140, 209))
            draw.line([(cx, cy + 10), (cx, cy + 60)], fill=(90, 70, 110), width=5)
            draw.arc([cx - 15, cy + 45, cx, cy + 65], 0, 180, fill=(90, 70, 110), width=5)
        elif icon == "icecream":
            draw.polygon([(cx - 30, cy + 10), (cx + 30, cy + 10), (cx, cy + 75)], fill=(225, 175, 120))
            draw.ellipse([cx - 35, cy - 40, cx + 35, cy + 20], fill=(255, 140, 180))
            draw.ellipse([cx - 25, cy - 65, cx + 25, cy - 15], fill=(168, 237, 234))
            draw_heart(draw, (cx, cy - 75), 10, (255, 80, 110))
        elif icon == "sunset":
            draw.ellipse([cx - 45, cy - 20, cx + 45, cy + 70], fill=(255, 120, 90))
            draw.ellipse([cx - 80, cy + 25, cx + 80, cy + 75], fill=(120, 70, 130))
            draw_sparkle(draw, (cx - 30, cy - 35), 12, (255, 235, 140))
        elif icon == "book":
            draw.rounded_rectangle([cx - 65, cy - 40, cx - 5, cy + 45], radius=6, fill=(255, 255, 255))
            draw.rounded_rectangle([cx + 5, cy - 40, cx + 65, cy + 45], radius=6, fill=(255, 255, 255))
            draw.line([(cx, cy - 40), (cx, cy + 45)], fill=(255, 107, 139), width=5)
            draw_heart(draw, (cx - 35, cy), 12, (255, 107, 139))
            draw_sparkle(draw, (cx + 35, cy), 12, (161, 140, 209))

        # Bottom text plaque
        draw.rounded_rectangle([80, h - 170, w - 80, h - 50], radius=16, fill=(255, 255, 255, 240))
        try:
            font_title = ImageFont.truetype("arial.ttf", 26)
            font_quote = ImageFont.truetype("arial.ttf", 18)
        except:
            font_title = ImageFont.load_default()
            font_quote = ImageFont.load_default()

        title_text = f"#{idx} {p['title']}"
        draw.text((w // 2 - len(title_text) * 7, h - 155), title_text, fill=(50, 45, 60), font=font_title)
        quote_text = f'"{p["quote"]}"'
        draw.text((w // 2 - len(quote_text) * 4, h - 105), quote_text, fill=(110, 100, 120), font=font_quote)

        img.save(f"images/{p['filename']}", "JPEG", quality=92)
        print(f"Generated images/{p['filename']}")

generate_gallery_photos()

# 3. GENERATE VIDEO POSTER
def generate_video_poster():
    w, h = 1280, 720
    img = create_gradient(w, h, (40, 30, 60), (95, 60, 110), vertical=True)
    draw = ImageDraw.Draw(img)

    # Ambient starry dust
    for pt in [(150, 120), (320, 180), (950, 160), (1100, 240), (200, 560), (1050, 580)]:
        draw_sparkle(draw, pt, 15, (255, 220, 120))
    for ht in [(260, 240), (1000, 320), (180, 420), (1080, 480)]:
        draw_heart(draw, ht, 16, (255, 120, 160))

    # Center cinematic badge
    cx, cy = w // 2, h // 2
    # Glowing circle
    draw.ellipse([cx - 90, cy - 90, cx + 90, cy + 90], fill=(255, 107, 139), outline=(255, 255, 255), width=6)
    # Play triangle
    draw.polygon([(cx - 25, cy - 40), (cx - 25, cy + 40), (cx + 45, cy)], fill=(255, 255, 255))

    try:
        font_main = ImageFont.truetype("arial.ttf", 36)
        font_sub = ImageFont.truetype("arial.ttf", 22)
    except:
        font_main = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    draw.text((cx - 260, cy + 130), "A Little Collection of Our Memories ❤️", fill=(255, 255, 255), font=font_main)
    draw.text((cx - 280, cy + 185), "Click Play to watch our personal friendship video", fill=(225, 215, 245), font=font_sub)

    img.save("images/video-poster.jpg", "JPEG", quality=92)
    print("Generated images/video-poster.jpg")

generate_video_poster()

