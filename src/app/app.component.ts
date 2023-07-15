import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, fromEvent, map, merge, Observable, of } from 'rxjs';

import { CityService } from './services/city.service';
import { SearchTypeEnum } from './enum/search-type.enum';

interface Options {
  id: number;
  label: string;
}

const DEBOUNCE_TIME = 500;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formControls: ElementRef[];

  options$: Observable<Options[]> = new BehaviorSubject<Options[]>([]);
  countriesOptions$: Observable<Options[]> = new BehaviorSubject<Options[]>([]);

  formObj: {};
  userForm: FormGroup;
  message: { [key: string]: string } = {};
  status: string;

  searchType = SearchTypeEnum.END;

  validationMessages: {
    [key: string]: { [key: string]: string | { [key: string]: string } };
  }

  constructor(private cityService: CityService,
              private fb: FormBuilder) {
    this.validationMessages = {
      firstName: {
        required: "Please enter your first name"
      },
      lastName: {
        required: "Please enter your last name"
      },
      email: {
        required: "Please enter your Email",
        email: "Please enter a valid email password"
      },
      lineOne: {
        required: "Please enter your address line one",
      },
      lineTwo: {
        required: "Please enter your address line two",
      },
      city: {
        required: "Please enter your city",
      },
      state: {
        required: "Please enter your state",
      },
      country: {
        required: "Please enter your country",
      }
    };
  }

  ngOnInit(): void {
    this.initUserForm();

    this.cityObserver();

    this.countryObserver();

    this.userForm.valueChanges.subscribe(
      () => {
        const { dirty, pristine, valid, errors, invalid, value } = this.userForm;
        this.status = JSON.stringify({ dirty, pristine, valid, errors, invalid, value })
      }
    );
  }

  ngAfterViewInit(): void {
    const addBlurs: Observable<any>[] = this.formControls.map((formControl: ElementRef) =>
      fromEvent(formControl.nativeElement, 'blur')
    );
    merge(this.userForm.valueChanges, ...addBlurs)
      .pipe(debounceTime(DEBOUNCE_TIME))
      .subscribe(() => {
        this.message = this.invalidInputs(
          this.userForm
        );
      });
  }

  initUserForm() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['',[ Validators.required, Validators.email]],
      address: this.fb.group({
        lineOne: ['', Validators.required],
        lineTwo: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
      }),
    });
  }

  cityObserver() {
    (this.userForm.controls['address'] as FormGroup).controls['city'].valueChanges.pipe(
      debounceTime(DEBOUNCE_TIME),
      distinctUntilChanged())
      .subscribe(value => {
        this.options$ = value ?
          this.options$ = this.cityService
            .getCities(value, this.searchType)
            .pipe(map(it => it.map(item => ({id: item.id, label: item.name}) as Options)))
          : of([]);
      });
  }

  countryObserver() {
    (this.userForm.controls['address'] as FormGroup).controls['country'].valueChanges.pipe(
      debounceTime(DEBOUNCE_TIME),
      distinctUntilChanged())
      .subscribe(value => {
        this.countriesOptions$ = value ?
          this.countriesOptions$ = this.cityService
            .getCountries(value)
            .pipe(map(it => it.map(item => ({id: item.id, label: item.name}) as Options)))
          : of([]);
      });
  }

  invalidInputs(formGroup: FormGroup): { [key: string]: string } {
    let messages = {};
    for (const input in formGroup.controls) {
      const key = formGroup.controls[input];
      if (key instanceof FormGroup) {
        const nestedGroupMessages = this.invalidInputs(key);
        Object.assign(messages, nestedGroupMessages)
      } else {
        if (this.validationMessages[input]) {
          messages[input] = '';
          if (key.errors && (key.dirty || key.touched)) {
            Object.keys(key.errors).map(messageKey => {
              if (this.validationMessages[input][messageKey]) {
                messages[input] = this.validationMessages[input][messageKey];
              }
            });
          }
        }
      }
    }
    return messages;
  }

  onSubmit() {
    let { formObj } = this;
    let { value } = this.userForm;
    const sth = JSON.stringify({ ...formObj, business: value });
    try {
      localStorage.setItem('form', sth);
    } catch {
      (e) => console.log(e);
    }
  }
}


