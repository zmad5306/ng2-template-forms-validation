import { TemplateFormsValidationPage } from './app.po';

describe('template-forms-validation App', () => {
  let page: TemplateFormsValidationPage;

  beforeEach(() => {
    page = new TemplateFormsValidationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
