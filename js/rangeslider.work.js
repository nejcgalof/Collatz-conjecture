var $document = $(document);
var $element = $('input[type=range]');
var $min = $('input[name="min"]');
var $max = $('input[name="max"]');
var $step = $('input[name="step"]');
var output = document.querySelector('output');

// Set initial output value
output.innerHTML = $element[0].value;

// Update output value
$document.on('input', 'input[type="range"]', function() {
  output.innerHTML = this.value;
});

// Initialize rangeslider.js
$element.rangeslider({
  polyfill: false
});

// Example functionality to demonstrate programmatic attribute changes
$document.on('click', '#js-example-change-attributes', function(e) {
  var attributes = {
    min: $min[0].value,
    max: $max[0].value,
    step: $step[0].value
  };
  // update attributes
  $element.attr(attributes);

  // pass updated attributes to rangeslider.js
  $element.rangeslider('update', true);
});