import json

from settings import BASE_DIR


def write_json_to_file(f_name, obj_to_write):
    with open(BASE_DIR + '/data/' + f_name, 'r') as f:
        current_info = json.load(f)
        if obj_to_write['name'] in current_info:
            # TODO: Return a message here and pass it forward for an API
            pass
    with open(BASE_DIR + '/data/' + f_name, 'w') as f:
        current_info[obj_to_write['name']] = obj_to_write
        json.dump(current_info, f, indent=2)
