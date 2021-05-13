$(document).ready(()=>{
    
    $('#add_item').click((e)=>{
        
        var list_item = $('#todoadder').val().trim();
        if(list_item){
        
        
        const content ={item: list_item};
        const date = String($('.curr_date').text().trim());
        
       $.ajax({
            type:'PUT',
            url:`/api/addtodo/${date}`,
            data: JSON.stringify(content),
            contentType:'application/json',
            dataType:'json',
            success:function(data){
                $('#todo_list').append(`<li class="todo list-group-item">${data.msg}</li>`);
                $('#todoadder').val("");
                $('#err_info').html(`<span style="font-weight:bold;">${data.msg}</span> added successfully`).css({"color":"green"});
            },
            error:function(err){
               console.log(err);
            }
        });

        }
        else{
            $('#err_info').html('please enter valid todo').css({"color":"red"});
        }
        
    });
    $("#todo_list").delegate('.todo','click',(e)=>{
        const date = String($('.curr_date').text().trim());
        const data = $(e.target).html();
        console.log("clicked");
        $.ajax({
            type:"PUT",
            url:`/api/deltodo/${date}`,
            dataType:'json',
            contentType:'application/json',
            data:JSON.stringify({data:data}),
            success:function(data){
                //console.log(data);
                $('#err_info').html(`<span style="font-weight:bold;color:red;">${data.msg}</span> deleted successfully`);
                $(e.target).remove();
            },
            error:function(err){
                console.log(err)
            }
        });
    });
    $('#delete_day').click(()=>{
        const date = String($('.curr_date').text().trim());
        $.ajax({
            type:"DELETE",
            url:`/api/del/${date}`,
            dataType:"json",
            success: function(data){
                console.log(data);
                window.location.href="/api";
            },
            error:function(err){
                console.log(err);
            }
        });
    })
   
});
