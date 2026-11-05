import re

text = open('node_modules/@tensorflow-models/mobilenet/dist/imagenet_classes.js', encoding='utf-8').read()
labels = re.findall(r"'([^']+)'", text)
labels = [x.replace('\\n', '') for x in labels if not x.startswith('imagenet')]
# The first two quoted strings are imports / module name.
labels = labels[2:]
print('count', len(labels))
keywords = [
    'bottle', 'can', 'carton', 'box', 'package', 'packet', 'paper', 'book', 'envelope', 'bag',
    'cup', 'mug', 'plate', 'bowl', 'jar', 'glass', 'plastic', 'metal', 'steel', 'iron',
    'computer', 'phone', 'keyboard', 'monitor', 'screen', 'camera', 'radio', 'printer',
    'battery', 'lighter', 'match', 'medicine', 'pill', 'syringe', 'thermometer', 'paint',
    'lamp', 'light', 'bulb', 'fluorescent', 'spray', 'chemical', 'mask', 'tissue', 'towel',
    'diaper', 'trash', 'garbage', 'waste', 'ash', 'cigarette', 'brick', 'stone', 'ceramic',
    'pottery', 'food', 'fruit', 'vegetable', 'banana', 'apple', 'orange', 'mushroom', 'pepper',
    'bread', 'cake', 'coffee', 'tea', 'egg', 'rice', 'pizza', 'fish', 'meat', 'chicken',
    'basket', 'bucket', 'chair', 'table', 'desk', 'bed', 'sofa', 'lamp', 'clock', 'mirror',
    'shoe', 'shirt', 'sweater', 'dress', 'hat', 'wallet', 'backpack', 'umbrella', 'toy',
    'ball', 'racket', 'skateboard', 'bicycle', 'scooter', 'refrigerator', 'washer', 'microwave',
    'toaster', 'vacuum', 'fan', 'drill', 'saw', 'hammer', 'screwdriver', 'wrench',
    'flower', 'leaf', 'seed', 'nut', 'corn', 'potato', 'tomato', 'carrot', 'cabbage',
]
seen = set()
for kw in keywords:
    hits = [x for x in labels if kw in x.lower()]
    if hits:
        print(f'\n## {kw}')
        for h in hits:
            if h not in seen:
                print(' ', h)
                seen.add(h)
