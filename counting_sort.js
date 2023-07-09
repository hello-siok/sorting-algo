var arr_len = 10;
var arr = [];
var ans = Array(10).fill(0);
var freq = Array(10).fill(0);
const max_value = 9;
const min_value = 0;
const speed = 1000;

generate_array(arr_len);
generate_array_div();

function sleep(ms){
    return new Promise(resolve => {setTimeout(resolve, ms)});
}

function de_color(className){
    var elements = document.querySelectorAll("." + className);
        
    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove(className);
    }
}

function disable_btn(status){
    var buttons = document.querySelectorAll("button");
    buttons.forEach((button) => button.disabled = status);
}

function generate_array(arr_len){
    freq = Array(10).fill(0);
    arr = [];

    for(let i=0; i< arr_len; i++){
        var random = Math.random();
        var randomNumber = Math.floor(random * (max_value));
        arr.push(randomNumber);
    }

    generate_array_div();
    clearResults();
    decelebrate();
}

function generate_array_div(){
    var wrapper = document.getElementById("array-wrapper");
    wrapper.innerHTML = "";

    for(let i =0; i< arr.length; i++){
        wrapper.innerHTML += `
        <div id="arr-item-${i}" class="original-item">${arr[i]}</div>
        `;
    }
}

function clearResults(){
    de_color("active");
    de_color("same");

    var elements = document.getElementsByClassName("arr-item");
    for(i in elements){
        elements[i].innerHTML = 0;
    }

    var answers = document.getElementsByClassName("arr-item-res");
    for(i in answers){
        answers[i].innerHTML = "";
    }
}

function celebrate(){
    var element = document.getElementById("final-text");
    element.classList.remove("hidden");
}

function decelebrate(){
    var element = document.getElementById("final-text");
    if (!element.classList.contains("hidden")){
        element.classList.add("hidden");
    }
}

async function counting_sort(){
    console.log("counting sort");
    disable_btn(true);

    //update frequency
    for(let i=0; i<10; i++){
        de_color("active");
        de_color("same");

        var val = arr[i];
        freq[val] += 1;

        var freq_box = document.getElementById(`arr-item-1-${val}`);
        freq_box.innerHTML = freq[val];
        freq_box.classList.add("active");

        var original_box = document.getElementById(`arr-item-${i}`);
        original_box.classList.add("same");

        var index_box = document.getElementById(`index-item-1-${val}`);
        index_box.classList.add("same");

        await sleep(speed);
    }
    de_color("active");
    de_color("same");

    //sum frequency
    for(let i=0; i<10; i++){
        de_color("active");
        de_color("same");

        if(i > 0){
            freq[i] += freq[i-1];

            var add1 = document.getElementById(`arr-item-2-${i-1}`);
            add1.classList.add("same");
        }

        var freq_box = document.getElementById(`arr-item-2-${i}`);
        freq_box.innerHTML = freq[i];
        freq_box.classList.add("active");

        var add2 = document.getElementById(`arr-item-1-${i}`);
        add2.classList.add("same");
        
        await sleep(speed);
    }

    //update starting index
    for(let i=9; i>=0; i--){
        de_color("active");
        de_color("same");

        var freq_box = document.getElementById(`arr-item-3-${i}`);

        if(i == 0){
            freq[i] = 0;
        }else{
            freq[i] = freq[i-1];

            var prev_box = document.getElementById(`arr-item-2-${i-1}`);
            prev_box.classList.add("same");
        }

        freq_box.innerHTML = freq[i];
        freq_box.classList.add("active");
        await sleep(speed);
    }

    //sort
    for(i=0;i<10;i++){
        de_color("same");
        de_color("active");

        var val = arr[i];
        var starting_index= freq[val];

        ans[starting_index] = val;
        freq[val] += 1;

        var original_box = document.getElementById(`arr-item-${i}`);
        original_box.classList.add("same");

        var index_box = document.getElementById(`index-item-3-${val}`);
        index_box.classList.add("same");

        var freq_box = document.getElementById(`arr-item-3-${val}`);
        //freq_box.innerHTML = freq[val];
        freq_box.classList.add("active");

        var ans_box = document.getElementById(`arr-item-4-${starting_index}`);
        ans_box.innerHTML = val;
        ans_box.classList.add("active");

        await sleep(speed);
    }

    celebrate();
    disable_btn(false);
}