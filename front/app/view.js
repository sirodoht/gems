/**
 * Fade in & out intros and splashes.
 */

// Hide GGJ splash.
setTimeout(() => {
  $('.ggj').fadeOut('slow');
}, 1000);

// Show intro
setTimeout(() => {
  $('.ritual-wrapper').fadeIn('fast');
}, 1600);

// Hide intro
$('#play').on('click', () => {
  $('.ritual-intro').fadeOut('fast');
  setTimeout(() => $('.ritual-content').fadeIn('fast'), 200);
});
