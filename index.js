const input_list = document.querySelector('#input-list');
const template = document.querySelector('#input-list-item-template');
const input_list_item = template.content.firstElementChild

function append_list_item(){
    let item = input_list_item.cloneNode(true)
    item.addEventListener('keydown', function(event){
        console.log(event.keyCode);
        let prev = event.target.parentElement.previousElementSibling?.children[0] || null;
        let next = event.target.parentElement.nextElementSibling?.children[0] || null;
        let last = input_list.children[input_list.children.length - 1].children[0] || null;
        let sibling;
        switch(event.keyCode){
            case 13: // enter key
                if(event.target.value)
                    append_list_item();
                break;
            case 8: // backspace
                if(event.target.value == '' && input_list.children.length > 1){
                    sibling = prev || next;
                    input_list.removeChild(event.target.parentElement)
                    if(sibling){
                        sibling.value += ' ';
                        sibling.focus();
                    }
                }
                break;
            case 38: // up arrow
                if(prev)
                    prev.focus();
                break;
            case 40: // down arrow
                if(next)
                    next.focus();
                else if(event.target.value)
                    append_list_item();
                break;
        }
    });
    if(document.activeElement.classList.contains('input-list-input'))
        document.activeElement.parentElement.insertAdjacentElement('afterend', item);
    else
        input_list.append(item);
    item.children[0].focus();
}

function update(){
    if(input_list.children.length == 0)
        append_list_item();
}

update();
