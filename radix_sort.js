var arr_len = 10;
var arr = [];
const max_value = 999;
const speed = 100;
const min_value = 1;

generate_array(arr_len);
generate_array_div();

function sleep(ms){
    return new Promise(resolve => {setTimeout(resolve, ms)});
}

function disable_btn(status){
    var buttons = document.querySelectorAll("button");
    buttons.forEach((button) => button.disabled = status);
}

async function add_item(place, arr){
    for(i in arr){
        var element = document.getElementById(`arr-item-${place}-${i}`);
        var content = "";

        if (place == 1){
            content += `<span>${Math.floor(arr[i]/10)}</span>`;
            content += `<span style="color:blue;font-weight:bold;">${arr[i]%10}</span>`;
        }else if (place == 10){
            content += `<span>${Math.floor(arr[i]/100)}</span>`;
            content += `<span style="color:blue;font-weight:bold;">${Math.floor((arr[i]%100)/10)}</span>`;
            content += `<span>${arr[i]%10}</span>`;
        } else if (place == 100){
            content += `<span style="color:blue;font-weight:bold;">${Math.floor(arr[i]/100)}</span>`;
            content += `<span>${Math.floor((arr[i]%100)/10)}</span>`;
            content += `<span>${arr[i]%10}</span>`;
        }

        element.innerHTML = content;
        await sleep(speed);
    }
}

function generate_array(arr_len){
    arr = [];

    for(let i=0; i< arr_len; i++){
        var random = Math.random();
        var randomNumber = Math.floor(random * (max_value - min_value + 1)) + min_value;
        arr.push(randomNumber);
    }

    generate_array_div();
    clearResults();
    decelebrate();
}

function generate_array_div(){
    var wrapper = document.getElementById("array-wrapper");
    wrapper.innerHTML = "";

    arr.forEach((item) => {
        wrapper.innerHTML += `
        <div id="arr-item" class="arr-item">${item}</div>
        `;
    });
}

function clearResults(){
    var elements = document.getElementsByClassName("arr-item-res");
    for(i in elements){
        elements[i].innerHTML = "";
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

async function radix_sort(){
    //console.log("radix_sort");
    disable_btn(true);

    var max_item = Math.max(...arr);
    var place = 1;

    while (Math.floor(max_item/place) > 0){
        var sub_arr = [];

        for(i in arr){
            item = arr[i];
            item = Math.floor(item/place);
            item = item % 10;

            sub_arr.push(item);
        }

        arr = countingSort(sub_arr, arr);
        await add_item(place, arr);
        //console.log(arr);
        await sleep(speed);

        place *= 10;
    }
    celebrate();
    disable_btn(false);
}

function countingSort(sub_arr, ori_arr){
    var max_val = Math.max(...sub_arr);

    var freq = Array(max_val + 1).fill(0);
    var ans = Array(sub_arr.length).fill(0);

    //count occurrence
    for (i in sub_arr){
        var value = sub_arr[i];
        freq[value] += 1;
    }

    //frequency array- add cumulative sum
    for (i in freq){
        if (i > 0){
            freq[i] += freq[i-1];
        }
    }

    //frequency array - shift to determine starting index
    for (let i = freq.length-1; i>=0; i--){
        if (i==0){
            freq[i] = 0;
        } else {
            freq[i] = freq[i-1];
        }
    }

    //sort based on place
    for (let i=0; i < sub_arr.length; i++){
        var value = sub_arr[i];
        var index = freq[value];

        ans[index] = ori_arr[i];
        freq[value] += 1;
    }

    return ans;
}