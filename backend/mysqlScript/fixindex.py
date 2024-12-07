import re
parsed_data = []
with open('data.txt', 'r+') as file:
    pattern = r"\('(.+)', ([\d.]+), (\d+), (\d+), '(.+)'\)"
    data = file.readlines()
    for line in data:
        print('🐢🐢🐢🐢🐢')
        print(line)
        title, price, author_id, pu_id, image_url = re.match(pattern, line).groups()
        escaped_title = title.replace("'", "`")
        parsed_data.append(f"('{escaped_title}', {price}, {author_id}, {pu_id}, '{image_url}'),\n")
    file.seek(0)
    file.writelines(parsed_data)
    file.truncate()
