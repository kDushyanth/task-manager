$(document).ready(()=>{
    var i=$("#todos").children().length;
   // console.log(i);
    $('#add').click(()=>{
        console.log(i,"add");
            $('#todos').append(`
            <div class="form-group">
                <input type="text" class="form-control" id="todo${i}" name="todos" >
            </div>
        `);
        i++;
    });
    $('#del').click(()=>{
       
        if(i>=2)
          {
              i--;
             // console.log(i,"del");
              $(`#todo${i}`).remove();
            
          } 
    });
    
});