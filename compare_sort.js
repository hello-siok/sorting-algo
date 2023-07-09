const num_of_bar = 100;
const bar_w = 5;
const max_h = 500;
const min_h = 50;
let speed = 2; 
var arr = [];

class UIHook{
    constructor(arr){
        this.arr = arr;
    }

    read(a){
        return arr[a];
    }

    swap(a, b){
        var bar_a = document.getElementById(`bar-${a}`);
        var bar_b = document.getElementById(`bar-${b}`);

        const tmp = arr[a];
        arr[a] = arr[b];
        bar_a.style.height = arr[b]+"px";

        arr[b] = tmp;
        bar_b.style.height = tmp+"px";
    }

    color(a, class_to_add){
        var element = document.getElementById(`bar-${a}`);
        element.classList.add(class_to_add);
        
        
    }

    decolor(a, class_to_remove){
        var element = document.getElementById(`bar-${a}`);
        if (element && element.classList.contains(class_to_remove)){
            element.classList.remove(class_to_remove);
        }
    }

    decolor_all(className) {
        var elements = document.querySelectorAll("." + className);
        
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove(className);
        }
    }

    updateHeight(index, height){
        document.getElementById(`bar-${index}`).style.height = (height + "px");
    }
}

//OTHER FUNCTIONS
function disable_bar_regenerate(status){
    var button = document.getElementById("btn-bar");
    button.disabled = status;
}

function disable_speed_change(status){
    var button = document.getElementById("btn-speed");
    button.disabled = status;
}

function changeSpeed(){
    speed = document.getElementById("speed").value;
    var speed_text = document.getElementById("updated-speed");
    speed_text.innerHTML = `updated speed = ${speed}`;
    console.log(speed);
}

//BAR REGENERATE
regenerate_bar();
function regenerate_bar(max_height = max_h, min_height=min_h, bar_width=bar_w, bar_num = num_of_bar){
    arr = [];
    var bar_wrapper = document.getElementById("bar-wrapper");
    bar_wrapper.innerHTML = '';

    for(let i = 0; i < bar_num; i++){
        //generate random height
        var random = Math.random();
        var randomNumber = Math.floor(random * (max_height - min_height + 1)) + min_height;

        arr.push(randomNumber);

        //generate HTML element
        bar_wrapper.innerHTML += `<div class="bar" id="bar-${i}" style="height: ${randomNumber}px; width: ${bar_width}px;"></div>`;
    }
}

// SORTING ALGO STARTS HERE
/// Bubble sort
async function bubbleSort(){
    const uihook = new UIHook(arr);
    disable_bar_regenerate(true);
    disable_speed_change(true);

    for(let j = 0; j < (num_of_bar); j++){
        for(let i = 1; i < (num_of_bar-j); i++){
            if(i>2){
                uihook.decolor(i-2, "active")
            }

            var i1 = arr[i-1];
            var i2 = arr[i];

            uihook.color(i, "active");
            uihook.color(i-1, "active");

            if (i1 > i2){
                uihook.swap(i-1, i);
            }

            await sleep(speed);
        }
    }

    disable_bar_regenerate(false);
    disable_speed_change(false);
}

/// merge sort
async function mergeSort2(){
    await mergeSort(0,100);
    disable_bar_regenerate(false);
    disable_speed_change(false);
}

async function mergeSort(start, end){
    disable_bar_regenerate(true);
    disable_speed_change(true);

    cur_arr = arr.slice(start, end);

    if (cur_arr.length <= 1) {
        return [start, end];
    }

    var middle = Math.floor(cur_arr.length/2);
    var [left_start, left_end] = await mergeSort(start, start + middle);
    var [right_start, right_end] = await mergeSort(start + middle, end);

    return await merge_base(left_start, left_end, right_start, right_end);

}

async function merge_base(l_start, left_end, r_start, r_end){
    // given 2 sorted arrays, sort them!
    var arr1 = arr.slice(l_start,left_end);
    var arr2 = arr.slice(r_start,r_end);

    var left_1 = 0;
    var left_2 = 0;
    const uihook = new UIHook(arr);

    uihook.decolor_all("active");

    while((left_1 + left_2) < (arr1.length + arr2.length)){
        var arr_i = l_start + left_1 + left_2;

        if(left_1 == arr1.length){
            var remaining = arr2.slice(left_2, arr2.length);
            remaining.forEach((remain) => {
                arr[arr_i] = remain;
                uihook.updateHeight(arr_i, remain);
                uihook.color(arr_i, "active");

                arr_i ++;
            });
            break;

        } else if(left_2 == arr2.length){
            var remaining = arr1.slice(left_1, arr1.length);
            remaining.forEach((remain) => {
                arr[arr_i] = remain;
                uihook.updateHeight(arr_i, remain);
                uihook.color(arr_i, "active");

                arr_i ++;
            });
            break;

        } else if (arr1[left_1] <= arr2[left_2]){
            var lower_height = arr1[left_1];
            arr[arr_i] = lower_height;
            uihook.updateHeight(arr_i, lower_height);
            uihook.color(arr_i, "active");

            left_1 ++;
        } else if (arr1[left_1] > arr2[left_2]){
            var lower_height = arr2[left_2];
            arr[arr_i] = lower_height;
            uihook.updateHeight(arr_i, lower_height);
            uihook.color(arr_i, "active");
            
            left_2 ++;
        }
        await sleep(speed);
    }

    return [l_start, r_end];
}

/// heap sort
async function heapSort(arr){
    disable_bar_regenerate(true);
    disable_speed_change(true);

    var last_parent = Math.floor(arr.length/2 - 1);
    var last_index = arr.length - 1;
    const uihook = new UIHook(arr);

    while(last_parent>=0){
        await heapify(arr, last_index, last_parent);
        last_parent--;
    }

    uihook.color(0,"active");
    
    while (last_index >= 0){
        uihook.swap(0,last_index);
        uihook.color(last_index,"active");
        last_index --;
        await heapify(arr, last_index, 0);
    }

    disable_bar_regenerate(false);
    disable_speed_change(false);

    return arr;
}

async function heapify(arr, length, parent){
    var left_child = parent * 2 + 1;
    var right_child = parent * 2 + 2;
    var largest = parent;
    const uihook = new UIHook(arr);

    await sleep(speed);
    uihook.decolor_all("intermediate");

    if (left_child <= length && arr[left_child] > arr[largest]){
        largest = left_child;
    }

    if (right_child <= length && arr[right_child] > arr[largest]){
        largest = right_child;
    }

    if (largest !== parent){
        uihook.swap(parent, largest);
        uihook.color(largest, "intermediate");
        //[arr[parent], arr[largest]] = [arr[largest], arr[parent]];
        arr = await heapify(arr, length, largest);
    }

    return arr;
}


/// QUICK Sort
var prev_active = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function quickSort2(){
    disable_bar_regenerate(true);
    disable_speed_change(true);
    await quickSort(arr,0,99);
    disable_bar_regenerate(false);
    disable_speed_change(false);
}

async function quickSort(arr, low, high){
    if (low < high){
        var pivot_after_sort = await partition(arr, low, high);

        await sleep(speed);
        await quickSort(arr, low, pivot_after_sort-1);
        await quickSort(arr, pivot_after_sort+1, high);
    }
}

async function partition(arr, low, high){
    var left_pnt = low-1;
    const uihook = new UIHook(arr);

    //color pivot
    uihook.color(high, "pivot");

    for (var i=low; i<high; i++){
        if(arr[i] < arr[high]){
            left_pnt ++;

            //color
            if(prev_active.length > 0){
                uihook.decolor(prev_active[0], "active");
                uihook.decolor(prev_active[1], "active");
                prev_active = [];
            }

            uihook.color(left_pnt, "active");
            uihook.color(i, "active");
            prev_active.push(left_pnt);
            prev_active.push(i);

            //swap
            uihook.swap(left_pnt, i);

            await sleep(speed);
        }
    }
    left_pnt ++;

    if(prev_active.length > 0){
        uihook.decolor(prev_active[0], "active");
        uihook.decolor(prev_active[1], "active");
        prev_active = [];
    }

    uihook.color(left_pnt, "active");
    uihook.color(i, "active");
    prev_active.push(left_pnt);
    prev_active.push(i);

    uihook.swap(left_pnt, high);
    await sleep(speed);

    uihook.decolor(high, "pivot");

    return left_pnt;

}


/// insertion Sort
async function insertionSort(){
    console.log('insertion!');
    disable_bar_regenerate(true);
    disable_speed_change(true);

    const uihook = new UIHook(arr);

    for(let i=1; i<arr.length; i++){
        uihook.decolor_all("active");
        uihook.decolor_all("intermediate");

        uihook.color(i, "active");

        for(let j=0; j<i; j++){
            uihook.color(j, "intermediate");
            if(arr[i] < arr[j]){
                var smaller = arr[i];

                //shift to right one position
                for(let k = i; k > j; k--){
                    uihook.swap(k, k-1);
                }

                //swap value
                arr[j] = smaller;
                break;
            }

            await sleep(speed);
        }
    }

    disable_bar_regenerate(false);
    disable_speed_change(false);
}

async function selectionSort(){
    disable_bar_regenerate(true);
    disable_speed_change(true);

    const uihook = new UIHook(arr);

    for(let i = 0; i < arr.length; i++){
        var smallest = i;
        uihook.color(i, "active");

        for (let j = i; j < arr.length; j++){
            uihook.decolor_all( "intermediate");
            /* uihook.color(smallest, "intermediate"); */
            uihook.color(j, "intermediate");

            if(arr[j] < arr[smallest]){
                smallest = j;
                
            }
            await sleep(speed);
        }

        uihook.swap(i, smallest);
        uihook.decolor_all( "intermediate");
    }

    disable_bar_regenerate(false);
    disable_speed_change(false);
}