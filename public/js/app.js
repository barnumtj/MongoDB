$('#clearButton').click(function () {
    $('#articles').html('')
});

$('#scrapeButton').click(function () {
    location.href = '/scrape'
    location.href = '/'
    console.log('clicked')
})
$('#savedButton').click(function () {
    console.log('clicked')
    location.href = '/saved'

})

var modal = document.getElementById('myModal');

var span = document.getElementsByClassName("close")[0];



$('#commentButton').click(function(){ 
    console.log('clicked')
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});



$('#deleteButton').click(function(){
    console.log('clicked')
    let articleId = $(this).data('id');
    $.ajax({
      url: '/delete/'+articleId,
      type: 'PUT',
      success: function (response) {
        window.location.href = '/saved';
      },
      error: function (error) {
        
      }
    });
  
});

$('#saveButton').click(function(){  
    let articleId = $(this).data('id');
    $.ajax({
      url: '/save/'+articleId,
      type: 'GET',
      success: function (response) {
        window.location.href = '/';
      },
      error: function (error) {
        
      }
    });
  });

