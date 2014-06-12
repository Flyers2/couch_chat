
var dburl = "http://localhost:5984/fast_chat",
    seeRoomsUrl = dburl + "/_design/seerooms/_view/rooms?group_level=1";
userName = "",
    recipient = '',
    updater = 0,
    message = '';


$('#nameInput').click(function() {
    userName = document.getElementById('theUser').value;
    if (userName) {
        console.log(userName);
        $('#userNameInput').modal('hide');
      

    }
});

$('#logout').click(function(){
    userName.length=0;
    recipeint='';
    $('.specific').css("display","none");
    $('#welcome').css("display","inherit").append($('#allRooms'));
    $('#allRooms').css("display","inherit");
    $('#userNameInput').modal('show');
});
$('#submit').click(function() {
    message = $('#inputChat').val();
    var package = JSON.stringify(
        {
            userName: userName,
            recipient: recipient,
            message: message
        }
    );

    $.ajax(
        {
            type: "POST",
            url: dburl,
            data: package,
            contentType: "application/json",
            success: (function() {
                $('#inputChat').val("");
            })

        }
    );
});
$('#userNameInput').modal('show');
function seeChats() {
    if (recipient && userName)
    {
        // old one $.getJSON(dburl + "/_changes?since=" + updater + "&include_docs=true", function(data) {
        $.getJSON(dburl + "/_changes?filter=roomlimit/theroom&recipient=" + recipient + "&since=" + updater + "&include_docs=true", function(data) {
            var scrollToBottom;
            data.results.forEach(function(result)
            {
                if ($('#messageArea').scrollTop() === ($('#messageArea')[0].scrollHeight)) {
                    scrollToBottom = true;
                }
                $('#chatMessages').append("<span class ='" + result.doc.userName + "'>" + result.doc.userName + ":" + "  " + result.doc.message + "<br></span>");
                if (result.doc.userName === userName && result.doc.userName !== 'anonymous') {
                    $('.' + result.doc.userName).css('color', 'red');
                }
                // if(scrollToBottom){
                $('#messageArea').scrollTop($('#messageArea')[0].scrollHeight);
                // }
            });
            updater = data.last_seq;
        });
    }
}
setInterval(seeChats, 800);

function getRooms() {
    $.getJSON(seeRoomsUrl, function(data) {
        $(data.rows).each(function(index, obj) {
            var roomName = obj.key;
            theRoom = $("<a href='#' id='" + roomName + "'>" + roomName + "</a><br>");
            $('#allRooms').append(theRoom);
            $(theRoom).click(function() {
                if (checkUsername()) {
                    console.log($('#' + roomName).html());//did not need to make id for roomName once it's local (var) then it's only for that iteration
                    recipient = roomName;
                    enterRoom(recipient);
                    /*$('#welcome').css("display", "none");
                     $('#allrooms').css('display', 'inherit');
                     $('.specific').css("display", "inherit");
                     $('#chatRoomTitle').html("now chatting in " + roomName);*/
                }
            });
        });
        $('#createRoom').appendTo("#allRooms").click(function() {
            if (checkUsername()) {
                $("#myModal").modal('show');
                $('#addRoomButton').click(function() {

                    recipient = $('#roomFromModal').val();
                    enterRoom(recipient);
                    console.log(recipient);
                });
            }
        });
    });
}
function ChangeRoomsMenu() {
    $('#allRooms').css({
        'float': 'right',
    });
    $('#allRooms').find('h3').html("change Room");

}
function enterRoom(recipient) {
    $('#messageArea').find('span').empty();
    updater = 0;
    $('#welcome').css("display", "none");
    ChangeRoomsMenu();
    $('#allRooms').appendTo($('#messageAndMenu'));
    $('.specific').css("display", "inherit");
    $('#chatRoomTitle').html("now chatting in " + recipient);
    $("#myModal").modal('hide');
}
function checkUsername() {
    if (userName.length > 0) {
        return true;
    }
    $("#userNameInput").modal('show');
    return false;
}
getRooms();
     