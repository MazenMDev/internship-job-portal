document.getElementById("contact-form")
.addEventListener("submit" , (event)=>{
    event.preventDefault()

    const formdata= new FormData();
    const email=document.querySelector(".contact-form #email").value;
    const firstname=document.querySelector(".contact-form #firstname").value;
    const lastname=document.querySelector(".contact-form #lastname").value;
    const message=document.querySelector(".contact-form #message").value;

    formdata.append(
        "firstname", firstname
    )

    formdata.append(
        "lastname", lastname
    )

    formdata.append(
        "message", message
    )

    formdata.append(
     "email", email   
    )
    fetch("../php/contactus.php", {
        method:"POST",
        body:formdata,
    }).then((result)=> result.json).then((data)=> { 
        if(data.status=="success")
        {
            alert(data.message)
        }
        else
        {
            alert("error with server")
        }
    }).catch(()=>alert("something went wrong"))
});

