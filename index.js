const input_list = document.querySelector('#input-list');
const template = document.querySelector('#input-list-item-template');
const input_list_item = template.content.firstElementChild;
const get_choice_button = document.querySelector('#get-choice-button');
const input_div = document.querySelector('#input-div');
const choice_div = document.querySelector('#choice-div');
const chosen = document.querySelector('#chosen');
const theme_link = document.querySelector('#theme');
const hash_seperator = ',';
let can_spin = true;

function set_cookie(key, value){
    document.cookie = key + '=' + value;
}

function get_cookie(key){
    let rows = document.cookie.split('; ');
    for(let i = 0; i < rows.length; i++){
        if(rows[i].startsWith(key)){
            return rows[i].split('=')[1];
        }
    }
    return null;
}

function get_random_array_element(array){
    return array[Math.floor(Math.random() * array.length)];
}

function set_theme(filename){
    theme_link.href = filename;
    set_cookie('theme', filename);
}

function remove_child(child){
    input_list.removeChild(child);
    update();
    if(input_list.children.length < 1) {
        append_list_item();
    }
}

function append_list_item(){
    let item = input_list_item.cloneNode(true);
    item.addEventListener('keydown', function(event){
        let prev = event.target.parentElement.previousElementSibling?.children[0] || null;
        let next = event.target.parentElement.nextElementSibling?.children[0] || null;
        let last = input_list.children[input_list.children.length - 1].children[0] || null;
        let sibling;
        switch(event.keyCode){
            case 13: // enter key
                if(event.target.value){
                    append_list_item();
                }
                break;
            case 8: // backspace
                if(event.target.value == '' && input_list.children.length > 1){
                    sibling = prev || next;
                    input_list.removeChild(event.target.parentElement);
                    if(sibling){
                        sibling.value += ' ';
                        sibling.focus();
                    }
                }
                break;
            case 38: // up arrow
                if(prev){
                    prev.focus();
                    if(!event.target.value){
                        input_list.removeChild(event.target.parentElement);
                    }
                }
                break;
            case 40: // down arrow
                if(next){
                    next.focus();
                }else if(event.target.value){
                    append_list_item();
                }
                break;
        }
    });
    if(document.activeElement.classList.contains('input-list-input')){
        document.activeElement.parentElement.insertAdjacentElement('afterend', item);
    }else{
        input_list.append(item);
    }
    item.children[0].focus();
}

function update(){
    get_choice_button.disabled = true;
    for(let i = 0; i < input_list.children.length; i++){
        if(input_list.children[i].children[0].value){
            get_choice_button.disabled = false;
            break;
        }
    }
    update_url();
}

function get_choices(){
    let arr = [];
    for(let i = 0; i < input_list.children.length; i++){
        if(input_list.children[i].children[0].value){
            arr.push(input_list.children[i].children[0].value);
        }
    }
    return arr;
}

function get_choice(){
    if(!can_spin) return;
    can_spin = false;
    input_div.style.display = 'none';
    choice_div.style.display = 'block';
    let delay = 50; // milliseconds
    let arr = get_choices();
    function spin(reps){
        chosen.style.animation = '';
        chosen.innerHTML = get_random_array_element(arr);
        void chosen.offsetWidth; // update the element
        if(reps == 0){
            chosen.style.animation = `drop-stop ${delay}ms`;
            can_spin = true;
        }else{
            chosen.style.animation = `drop ${delay}ms`;
            setTimeout(spin, delay, reps - 1);
        }
        delay += 10;
    }
    spin(20); // spin 20 times

}

function change_choices(){
    input_div.style.display = '';
    choice_div.style.display = '';
}

function update_url(){
    const choices = get_choices()
        .map(encodeURIComponent)
        .join(hash_seperator);
    window.location.replace(location.origin + '#' + choices);
}

function main(){
    document.addEventListener('keydown', event=>{
        if(event.target != document.body) return;
        switch(event.keyCode){
            case 38: // up arrow
                input_list.children[0]?.children[0]?.focus();
                break;
            case 40: // down arrow
                input_list.children[input_list.children.length - 1]?.children[0]?.focus();
                break;
        }
    });
    set_theme(get_cookie('theme') || 'default_theme.css');
    const items = window.location.hash
        .substring(1)
        .split(hash_seperator)
        .filter(x=>x)
        .map(decodeURIComponent);
    console.log(items);
    if(items.length > 0){
        items.map((value, index)=>{
            append_list_item();
            input_list.children[index].children[0].value = value;
        });
        get_choice();
    }else{
        append_list_item();
    }
    update();
}

main();
