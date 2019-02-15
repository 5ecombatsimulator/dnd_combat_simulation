def capitalize(lower_string):
    split_string = lower_string.split(" ")
    ret_split_str = []
    for substr in split_string:
        capital_first = substr[0].upper()
        ret_split_str.append(capital_first + substr[1:])
    return " ".join(ret_split_str)
