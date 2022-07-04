$(document).ready(()=>{
    $('.view_day>h1').on('click',(e)=>{
const date = $(e.target).text().trim();
    document.location.href=`/api/day/${date}`;
});
});