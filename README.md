# make-editable

## To Use

1. Include jquery.editable.js and editable.css to your page.
2. Attach `editable` to your selected elements

  `$('someselector').editable(url, method, args);`

3. The arguments to the `editable` call are:
  1. *url*: the ajax call's url
  2. *method*: the method to be called at the ajax url path
  3. *args*: any "global" default arguments to pass to every the ajax-called method

Inside the editable element, pressing return or the element losing focus will send the data to the server. Pressing escape will revert the element's value to its initial state.

## Additional Options

When the ajax call is made, it will send the value of the editable item as the argument `value` to the ajax method. Adding a `data-fieldname` attribute to the editable item will also send a `field` argument to the ajax method with that field name.

Optionally, you can also include a `data-arguments` attribute with a JSON-encoded associative array of arguments to also pass to the ajax-called method.

## AJAX Return

The return from the ajax call should return a JSON-formatted associative array with the keys:
  * *success*: a boolean value representing if the data was successfully received
  * *message*: an optional message to show the user
  
  If `!success`, the element will be given the `editable-error` class, allowing for server-side validation.

## Example

Assumptions:
  * an ajax url of `http://dannyrich.com/ajax.php`
  * a method named `saveData`
  * a global id of 1
  * editable elements given a `data-editable` attribute

  `$('[data-editable]').editable('http://dannyrich.com/ajax.php', 'saveData', { id: 1 });`
  
  The individual editable elements will look like:
  
  `<div data-editable="true" data-fieldname="column5" data-arguments='{"something"="nothing"}'>I'm editable</div>`
