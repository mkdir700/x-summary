from PIL import Image, ImageDraw

def create_icon(size):
    # 创建一个新的图像，使用 RGBA 模式支持透明度
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 计算圆的大小和位置
    padding = size // 10
    circle_size = size - (2 * padding)
    
    # 绘制蓝色背景圆
    draw.ellipse(
        [padding, padding, padding + circle_size, padding + circle_size],
        fill='#1DA1F2'
    )
    
    # 绘制白色方块（代表文本）
    text_padding = size // 4
    rect_height = size // 6
    draw.rectangle(
        [text_padding, size//2 - rect_height,
         size - text_padding, size//2 + rect_height],
        fill='white'
    )
    
    return img

# 生成不同尺寸的图标
sizes = [16, 48, 128]
for size in sizes:
    icon = create_icon(size)
    icon.save(f'icons/icon{size}.png')
