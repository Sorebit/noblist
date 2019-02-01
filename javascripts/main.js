$(document).ready(() => {
  let id = 0;

  const isBlank = function(s) {
    return !s || /^\s*$/.test(s);
  }

  // Convert list to string
  // No compression yet
  const stringifyList = function() {
    const $list = $('.main-list');
    const $items = $list.find('.main-list-item');
    let stringified = "";
    $.each($items, (k, v) => {
      const checkbox = $(v).find('input[type=checkbox]')[0].checked;
      const labelText = $(v).find('label').text();

      const str = (checkbox ? '1' : '0') + labelText + ';';
      stringified += str;
    });

    return stringified;
  }

  // Convert location hash to object array
  // No decompression yet
  const processHash = function() {
    // This should work for site-generated links
    // TODO: Error handling
    const hash = location.hash.substring(1);
    if(!hash) {
      return [];
    }
    const items = hash.split(";");
    let res = [];

    for(let i = 0; i < items.length; i++) {
      items[i] = decodeURI(items[i]);
      let checked = false;
      let text = "";
      if(items[i].charAt(0) == "1") {
        checked = true;
        text = items[i].substring(1);
      } else if(items[i].charAt(0) == "0") {
        text = items[i].substring(1);
      } else {
        text = items[i];
      }
      if(text) {
        res.push({checked: checked, text: text });
      }
    }

    return res;
  }

  // Add item to list
  const addListItem = function(item) {
    if(!item.text) return;

    const $li = $('<li class="main-list-item">');

    const $input = $('<input type="checkbox" id="' + id + '" name="' + id + '" class="main-list-item-checkbox">');
    if(item.checked) {
      $input.prop('checked', 'true');
    }

    const $label = $('<label for="' + id + '">' + item.text + '</label>');
    const $btn = $('<button type="button" class="btn-remove-list-item btn btn-outline-danger btn-sm">✖</buttton>');

    $li.append($input);
    $li.append($label);
    $li.append($btn);
    $('ul.main-list').append($li);    

    id++;
  }

  // Load list from item array
  const loadList = function(items) {
    for (let i = 0; i < items.length; i++) {
      addListItem(items[i]);
    }
  }

  // Process location hash and load initial list
  const ph = processHash();
  loadList(ph);

  // Get URL button handler
  $('.btn-get-url').click((e) => {
    location.hash = stringifyList();
    location.reload();
  });

  // Remove button handler
  $('.btn-remove-list-item').on('click', (e) => {
    $(e.target).parent().remove();
  });

  // Submit handler for 'new item' form
  $('.form-new-item').submit((e) => {
    const $target = $(e.target);
    const $input = $target.find('#newItem');
    const text = $input.val();
    if(!isBlank(text)) {
      addListItem({ text: text, checked: false });
    }

    $input.val('');
    return false;
  });

  $('.cover').fadeIn();
});