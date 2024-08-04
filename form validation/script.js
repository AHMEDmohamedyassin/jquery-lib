$(function (){
    $("form").attr("novalidate" , true)
})


let errorMsg = {
    1000 : {
        "ar" : " الرجاء إدخال البيانات المطلوبة",
        "en" : ""
    },
    1001 : {
        "ar" : "الرجاء إدخال بريد إليكتروني صحيح",
        "en" : "please enter correct email"
    },
    1002 : {
        "ar" : "الرجاء إدخال رقم",
        "en" : ""
    },
    1003 : {
        "ar" : "أكبر رقم مسموح به هو {{value}}",
        "en" : ""
    },
    1004 : {
        "ar" : "أصغر رقم مسموح به هو {{value}}",
        "en" : ""
    },
    1005 : {
        "ar" : "أكبر عدد من العناصر مسموح به هو {{value}}",
        "en" : ""
    },
    1006 : {
        "ar" : "أصغر عدد من العناصر مسموح به هو {{value}}",
        "en" : ""
    },
    1007 : {
        "ar" : "كلمتا المرور غير متشابهتين",
        "en" : ""
    },
    1008 : {
        "ar" : "أكبر عدد من الملفات مسموح به هو {{value}}",
        "en" : ""
    },
    1009 : {
        "ar" : "يجب أن تكون الملفات بالإمتداد التالية {{value}}",
        "en" : ""
    },
    1010 : {
        "ar" : "يجب أن يكون كل ملف أصغر من  {{value}} mb",
        "en" : ""
    },
}

function getErrorMsg (number , value , language = null) {
    let lang = $("html").attr("lang") ?? "ar"
    if(language) lang = language
    
    return errorMsg[number][lang].replaceAll("{{value}}" , value)
}


function verify_form (e) {
    e.preventDefault()
    $form = $(e.target)
    let inputs = $form.find("input")
    const formData = new FormData()
    let total_errors = 0

    // initialize error msgs
    $("span.form_error_span_notification").remove()
    $("div.form_error_div_notification").remove()
    let notation_span = '<span class="material-symbols-outlined text-xs">error</span>'

    inputs.each(function () {
        let value = $(this).val()
        let name = $(this).attr("name")
        let type = $(this).attr("type")
        let required = $(this).attr("required")
        let minlength = $(this).attr("minlength")
        let maxlength = $(this).attr("maxlength")
        let min = $(this).attr("min")
        let max = $(this).attr("max")
        let sameto = $(this).attr("sameto")
        let mimes = $(this).attr("mimes")
        let maxsize = parseInt($(this).attr("maxsize")) * 1000
        let maxfiles = $(this).attr("maxfiles")


        let msg = []

        // checking if value is required
        if(required && !value)
            msg.push(getErrorMsg(1000))
        // checking if value is email
        if(type == 'email' && ! /^\w+([\.-]?\w+)*@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com)$/.test(value))
            msg.push(getErrorMsg(1001))
        // checking if value is number
        if(type == 'number' && isNaN(value))
            msg.push(getErrorMsg(1002))
        // checking maximum number
        if(type == 'number' && parseFloat(value) > max)
            msg.push(getErrorMsg(1003 , max))
        // checking minimum number
        if(type == 'number' && parseFloat(value) < min)
            msg.push(getErrorMsg(1004 , min))
        // checking maximum length of input
        if(value.length > maxlength)
            msg.push(getErrorMsg(1005 , maxlength))
        // checking minimum length of input
        if(value && value.length < minlength)
            msg.push(getErrorMsg(1006 , minlength))
        // checking password validation
        if(sameto && $form.find(`input[name='${sameto}']`).val() != value )
            msg.push(getErrorMsg(1007))
        //checking max files number
        if(type == "file" && maxfiles && maxfiles < $(this)[0].files.length){
            msg.push(getErrorMsg(1008 , maxfiles))
        }
        // checking files mime
        if(type == "file" && mimes){
            for(let file of $(this)[0].files){
                let file_mime = file.type.split('/')[1]
                if(mimes.includes(file_mime)) continue
                msg.push(getErrorMsg(1009 , mimes))
                break
            }
        }
        // checing max file size
        if(type == "file" && maxsize){           
            for(let file of $(this)[0].files){
                if(maxsize >= file.size) continue
                msg.push(getErrorMsg(1010 , maxsize))
                break
            }
        }
        // checing if files is required
        if(type == "file" && required && !$(this)[0].files.length){  
            msg.push(getErrorMsg(1000))         
        }


        if(!msg.length){
            if(type == 'file'){
                for(let file of $(this)[0].files)
                    formData.append(name , file)
            }
            else if(type != 'file' && value) formData.append(name , value)
            return 
        }

        // updating total errors
        total_errors += msg.length

        // creating div content
        let div_content = '' 
        msg.map(e => {
            div_content += `<p>${e}</p>`
        })

        // get parent width
        let parentWidth = $(this).parent().css("width")
        
        // appending html elements to input parent div
        $(this).parent().css({
            position:"relative"
        }).append(`
            <span class="form_error_span_notification absolute top-[100%] text-[10px] text-red-600 select-none flex items-center gap-x-1 max-w-[${parentWidth}] overflow-hidden truncate " style="display:none;">${notation_span} ${msg[0]}</span>
            <div class="form_error_div_notification absolute top-[110%] text-[10px] text-red-600 select-none gap-x-1 flex flex-col bg-white p-2 border-red-500 border-[1px] rounded z-10 max-w-[${parentWidth}]"  style="display:none;"><span class="w-full text-center">${notation_span}</span> ${div_content}</div>
        `)
    })

    // styling the error span and handle clicking actions
    $("span.form_error_span_notification").fadeIn().click(function () {
        $(this).fadeOut()
        $(this).siblings("div.form_error_div_notification").fadeIn().click(function () {
            $(this).fadeOut()
            $(this).siblings("span.form_error_span_notification").fadeIn()
        })
    })


    // returning form data incase of no error
    if(!total_errors)
        return {success : true , data : formData}

    // scrolling to top of form in case of error
    $("body , html").animate({
        scrollTop : $form.offset().top - 20
    })

    // returning error numbers
    return {sucess : false , data : total_errors}
}