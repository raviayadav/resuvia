import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverPageModalComponent } from './cover-page-modal.component';

describe('CoverPageModalComponent', () => {
  let component: CoverPageModalComponent;
  let fixture: ComponentFixture<CoverPageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverPageModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverPageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
