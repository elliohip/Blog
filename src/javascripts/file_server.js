import domPurify from "dompurify"


let article_form = document.getElementById("create-article-form-ident");
let article_title = document.getElementById("create-article-title");
let article_description = document.getElementById("create-article-title");
let article_content = document.getElementById("create-article-title");
let article_penname = document.getElementById("create-article-title");
let article_file = document.getElementById("create-article-file");

// IMPORTANT FOR CSS LOADER
if (article_form) {
 article_form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    let data = new FormData();

    console.log(article_file.value)

    data.append("author_pen_name", article_penname.value);
    console.log("name " + data);
    console.log(data.get("author_pen_name"))
    data.append("title", article_title.value);
    console.log("title" + data);
    data.append("description", article_description.value);
    console.log("description" + data);


        data.append("article_file", article_file.files[0]);
    
    console.log("file" + data);

    console.log(...data)
    
    fetch('http://localhost:3000/user/dashboard/create_article', {
        method: 'POST',
        body: data
    }).then(res => res.json())
    
 });
};