import Server from "../Server/Server";
import AppAttribute from "../../enums/app-attribute";
import AppCssClass from "../../enums/app-css-class";
import AppEndPoint from "../../enums/app-endpoint";
import AppID from "../../enums/app-id";
import AppMethod from "../../enums/app-method";
import AppTag from "../../enums/app-tag";
import AppTextContent from "../../enums/app-text-content";
import AppType from "../../enums/app-type";
import View from "../Views/View";

export default class AuthPage extends View {
  protected _component = document.createElement(AppTag.SECTION);
  private form = this.createBlock(AppTag.FORM, AppCssClass.REGISTRATION_FORM);
  private loginInput = this.createInput(AppCssClass.FORM_INPUT, AppType.TEXT, AppID.LOGIN);
  private loginSpan = this.createBlock(AppTag.SPAN, AppCssClass.FORM_SPAN)
  private nickNameInput = this.createInput(AppCssClass.FORM_INPUT, AppType.TEXT, AppID.NICK_NAME)
  private nickNameSpan = this.createBlock(AppTag.SPAN, AppCssClass.FORM_SPAN)
  private passWordInput = this.createInput(AppCssClass.FORM_INPUT, AppType.PASSWORD, AppID.PASSWORD)
  private passWordSpan = this.createBlock(AppTag.SPAN, AppCssClass.FORM_SPAN)
  private imageInput = this.createInput(AppCssClass.FORM_INPUT, AppType.FILE, AppID.IMAGE)
  private submitFormBtn = this.createBlock(AppTag.BUTTON, AppCssClass.BUTTON);
  public nickName: string | undefined
  private server:Server;
  constructor() {
    super();
    this.createComponent();
    this.server = new Server();
    this.getCookie('battleship')
  }
  getCookie(name: string) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
  handleForm() {
    this.loginSpan.innerHTML = "";
    this.nickNameSpan.innerHTML = ""
  }
  sendForm(event: Event) {
    event.preventDefault()
    if(this.form instanceof HTMLFormElement) {
      const dataObj = JSON.stringify(Object.fromEntries(new FormData(this.form)));
      this.server.postUser(dataObj)
      .then((response) => {
        console.log('====================================');
        console.log(response);
        console.log('====================================');
        switch (response) {
          case 400: {
            this.loginSpan.innerHTML = "Ошибка регистрации"
            break;
          }
          case 401: {
            this.loginSpan.innerHTML = "Такой пользователь уже есть"
            break;
          }
          case 403: {
            this.nickNameSpan.innerHTML = "Никнейм занят"
            break;
          }
          default: {
            if (response && typeof response==='object') {
              console.log('====================================');
              console.log('====================================');
                this.nickName = response.login
                console.log(response.login, this.nickName);
            }
              this._component.classList.add('hidden')
              break;
          }

        }
      })
    }
  }
  protected createComponent(): void {
    this._component.classList.add(AppCssClass.REGISTRATION)
    // this.form.setAttribute(AppAttribute.ACTION, AppEndPoint.SIGNUP);
    this.form.setAttribute(AppAttribute.METHOD, AppMethod.POST);
    this.form.setAttribute(AppAttribute.ENCTYPE, AppAttribute.FORM_ENCTYPE);
    this.form.classList.add(AppCssClass.FORM);

    const loginBlock = this.createInputBlock(
      AppTag.DIV,
      AppCssClass.FORM_INPUT_BLOCK,
      AppID.LOGIN,
      AppTextContent.LOGIN
    )

    const nickNameBlock = this.createInputBlock(
      AppTag.DIV,
      AppCssClass.FORM_INPUT_BLOCK,
      AppID.NICK_NAME,
      AppTextContent.NICK_NAME
    )
    // nickNameBlock.classList.add(AppCssClass.HIDDEN)
    const passwordBlock = this.createInputBlock(
      AppTag.DIV,
      AppCssClass.FORM_INPUT_BLOCK,
      AppID.PASSWORD,
      AppTextContent.PASSWORD
    )
    const fileLoadBlock = this.createBlock(AppTag.FORM, AppCssClass.FORM_INPUT_BLOCK)

    const imageLabelSpan = this.createBlock(AppTag.SPAN, AppCssClass.FORM_LABEL);
    imageLabelSpan.classList.add(AppCssClass.IMAGE_LABEL)
    imageLabelSpan.innerHTML = AppTextContent.AVATAR

    const imageBtnSpan = this.createBlock(AppTag.SPAN, AppCssClass.BUTTON_BLUE);
    imageBtnSpan.classList.add(AppCssClass.FORM_FILE_BTN)
    imageBtnSpan.classList.add(AppCssClass.BUTTON)
    imageBtnSpan.innerHTML = AppTextContent.CHOOSE_AVATAR

    loginBlock.append(this.loginSpan, this.loginInput)
    nickNameBlock.append(this.nickNameSpan, this.nickNameInput)
    passwordBlock.append(this.passWordSpan, this.passWordInput)
    this.loginInput.addEventListener('input', () => this.handleForm())
    this.nickNameInput.addEventListener('input', () => this.handleForm())
    this.passWordInput.addEventListener('input', () => this.handleForm())
    fileLoadBlock.append(imageLabelSpan, imageBtnSpan, this.imageInput)
    // fileLoadBlock.classList.add(AppCssClass.HIDDEN)
    this.submitFormBtn.classList.add(AppCssClass.BUTTON_BLUE)
    this.submitFormBtn.classList.add(AppCssClass.FORM_SUBMIT_BTN)
    this.submitFormBtn.setAttribute(AppAttribute.TYPE, AppType.SUBMIT)
    this.submitFormBtn.innerHTML = AppTextContent.SUBMIT;
    this.submitFormBtn.addEventListener('click', (event) => this.sendForm(event))
    this.form.append(loginBlock, nickNameBlock, passwordBlock, fileLoadBlock, this.submitFormBtn)
    this._component.append(this.form)
  }
}