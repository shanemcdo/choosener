const input_list = document.querySelector('#input-list');
const template = document.querySelector('#input-list-item-template');
const input_list_item = template.content.firstElementChild

function append_list_item(){
    input_list.append(input_list_item.cloneNode(true));
}

append_list_item();
