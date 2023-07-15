import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[libAutocompleteContent]'
})
export class AutocompleteContentDirective {

  constructor(public tpl: TemplateRef<any>) {
  }

}
