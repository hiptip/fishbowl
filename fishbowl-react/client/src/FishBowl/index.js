//manage state here

class FishBowl extends React.Component {
    render() {
      return;
    }
  }


var socket = io.connect('localhost:9000');

socket.on('timer', function (data) {
    $('#counter').html(data.countdown);
});

$('#reset').click(function() {
    socket.emit('reset');
});