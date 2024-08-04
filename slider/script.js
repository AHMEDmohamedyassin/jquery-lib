$(function () {

    $('[data-slider="slider_container"]').each(function (){

        let active = 0;
    
        // appending controllers and adding classes to container
        let parent = $(this)
        .addClass('bg-black/50 overflow-hidden flex')
        .wrap('<div data-slider="slider-controller" class="w-full"></div>')
    
        let sliders_count = parent.children('div').length
        let controller_container = parent.parent('[data-slider="slider-controller"]').addClass('relative').append(`
            <span data-slider="controller_next" class="material-symbols-outlined absolute top-2/4 -translate-y-2/4 text-white left-4 lg:text-5xl sm:text-3xl text-2xl select-none cursor-pointer">arrow_back_ios</span>
            <span data-slider="controller_prev" class="material-symbols-outlined absolute top-2/4 -translate-y-2/4 text-white right-4 lg:text-5xl sm:text-3xl text-2xl select-none cursor-pointer">arrow_forward_ios</span>
    
            <div data-slider="slider-cirles" class="absolute bottom-1 left-2/4 -translate-x-2/4 h-4  flex justify-center items-center gap-x-2">
                ${
                    Array(sliders_count).fill(0).map(e => `<p class="border-white border-[1px] rounded-full w-2 aspect-[1/1] hover:cursor-pointer hover:bg-white"></p>`)?.join('')
                }
            </div>    
        `)
    
        // initialization
        parent.children('[data-slider="img_container"]')
        .addClass('flex-none h-full w-full relative')
        .children("img").addClass('object-cover object-center inset-0 absolute')
    
        parent.children('[data-slider="img_container"]').first().addClass("active")
    
    
    
        // activate cirles
        function activate_circle (){
            controller_container.find('[data-slider="slider-cirles"]')
            .children('p').removeClass('bg-white')
    
            controller_container.find('[data-slider="slider-cirles"]').children(`p:nth(${active})`)
            .addClass('bg-white')
    
        }
        activate_circle()
    
    
        // next slider functions 
        function next_slider (){
            active += 1
            if(sliders_count <= active) {
                active = 0
                parent.animate({
                    scrollLeft : parent.innerWidth()
                },100)
            }else {
                parent.animate({
                    scrollLeft : -parent.innerWidth() * active
                },300)
            }
            
            activate_circle()
        }
        // previous slider functions 
        function prev_slider (){
            active -= 1
            if(active < 0 ) {
                active = sliders_count -1
                parent.animate({
                    scrollLeft : -parent.innerWidth() * active
                },100)
            }else{
                parent.animate({
                    scrollLeft : -parent.innerWidth() * active
                },300)
            }
    
            activate_circle()
        }
    
        // assign arrows controller
        controller_container.find('[data-slider="controller_next').click(next_slider)
        controller_container.find('[data-slider="controller_prev').click(prev_slider)
        
    
        // touch controller
        let dragging = false
        let startX = 0
    
        parent.on("touchstart" , function (event) {
            var touches = event.originalEvent.touches;
            if (touches.length > 0) {
                var touch = touches[0];
                var x = touch.pageX;
                var y = touch.pageY;
    
                dragging = true
                startX = x
            }
        })
        parent.on("touchmove" , function (event) {
            var touches = event.originalEvent.touches;
            if (touches.length > 0 && dragging) {
                var touch = touches[0];
                var x = touch.pageX;
                var y = touch.pageY;
    
                dragging = false
    
                if(x > startX) return next_slider()
                else return prev_slider()
            }
        })

    })



})