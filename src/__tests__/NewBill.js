/**
 * @jest-environment jsdom
 */

import {fireEvent, screen } from "@testing-library/dom"
import { ROUTES } from "../constants/routes.js"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { bills } from "../fixtures/bills.js"
import userEvent from "@testing-library/user-event"
import store from "../__mocks__/store.js"


describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    const inputData = bills[0]
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
      email: inputData.email
    }))
  })

  describe("When I am on NewBill Page", () => {
    test("Then it should renders NewBill Page", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const inputExpenseName = screen.getByTestId("expense-name")
      expect(inputExpenseName.value).toBe("")

      const inputExpenseAmount = screen.getByTestId("amount")
      expect(inputExpenseAmount.value).toBe("")

      const inputExpenseCommentary = screen.getByTestId("commentary")
      expect(inputExpenseCommentary.value).toBe("")

      const inputExpenseFile = screen.getByTestId("file")
      expect(inputExpenseFile.value).toBe("")
    })
    // POST integration
    describe("When I do fill fields in correct format and I click the submit button", () => {
      test("Then it should submit the form", async () => {
        document.body.innerHTML = NewBillUI()
        const inputData = bills[0]

        const form = screen.getByTestId("form-new-bill");

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const newbill = new NewBill({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage
        });
        
        const inputExpenseType = screen.getByTestId("expense-type")
        fireEvent.change(inputExpenseType, { target: { value : inputData.type } })
        expect(inputExpenseType.value).toBe(inputData.type)

        const inputExpenseName = screen.getByTestId("expense-name")
        fireEvent.change(inputExpenseName, { target: { value : inputData.name } })
        expect(inputExpenseName.value).toBe(inputData.name)

        const inputExpenseDate = screen.getByTestId("datepicker")
        fireEvent.change(inputExpenseDate, { target: { value : inputData.date } })
        expect(inputExpenseDate.value).toBe(inputData.date)

        const inputExpenseAmount = screen.getByTestId("amount")
        fireEvent.change(inputExpenseAmount, { target: { value : inputData.amount } })
        expect(parseInt(inputExpenseAmount.value)).toBe(inputData.amount)

        const inputExpenseVAT = screen.getByTestId("vat")
        fireEvent.change(inputExpenseVAT, { target: { value : inputData.vat } })
        expect(inputExpenseVAT.value).toBe(inputData.vat)

        const inputExpensePCT = screen.getByTestId("pct")
        fireEvent.change(inputExpensePCT, { target: { value : inputData.pct } })
        expect(parseInt(inputExpensePCT.value)).toBe(inputData.pct)

        const inputExpenseCommentary = screen.getByTestId("commentary")
        fireEvent.change(inputExpenseCommentary, { target: { value : inputData.commentary } })
        expect(inputExpenseCommentary.value).toBe(inputData.commentary)

        const inputExpenseFile = screen.getByTestId("file")
        // On crée un fichier de test et on l'upload dans l'input
        const inputFileMIMEtype = inputData.fileName.split(".")[1]
        const testImageFile = new File([inputData.fileUrl], inputData.fileName, { type : `image/${inputFileMIMEtype}`})
        await userEvent.upload(inputExpenseFile, testImageFile)

        const handleSubmit = jest.fn(newbill.handleSubmit)
        form.addEventListener("submit", handleSubmit)

        fireEvent.submit(form)
        expect(handleSubmit).toHaveBeenCalled()
      })

      test("Then it should renders Bills page", () => {
        expect(screen.getByText("Mes notes de frais")).toBeTruthy();
      })
    })
    describe("When I don't fill required fields and I click the submit button", () => {
      test('Then it should not submit the form', () => {
        document.body.innerHTML = NewBillUI()
        const inputData = bills[0]

        const form = screen.getByTestId("form-new-bill");

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const newbill = new NewBill({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage
        });
        // On ne remplit qu'un champ
        const inputExpenseType = screen.getByTestId("expense-type")
        fireEvent.change(inputExpenseType, { target: { value : inputData.type } })
        expect(inputExpenseType.value).toBe(inputData.type)

        const handleSubmit = jest.fn(newbill.handleSubmit)
        form.addEventListener("submit", handleSubmit)
        fireEvent.submit(form)
        expect(handleSubmit).toHaveBeenCalled()
      })
      test("Then it should not renders Bills page", () => {
        expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
      })
    })
    describe("When I do fill fields but have a wrong extension for the file", () => {
      test("Then it should not submit the form", async () => {
        document.body.innerHTML = NewBillUI()
        const inputData = bills[0]

        const form = screen.getByTestId("form-new-bill");

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const newbill = new NewBill({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage
        });
        
        const inputExpenseType = screen.getByTestId("expense-type")
        fireEvent.change(inputExpenseType, { target: { value : inputData.type } })
        expect(inputExpenseType.value).toBe(inputData.type)

        const inputExpenseName = screen.getByTestId("expense-name")
        fireEvent.change(inputExpenseName, { target: { value : inputData.name } })
        expect(inputExpenseName.value).toBe(inputData.name)

        const inputExpenseDate = screen.getByTestId("datepicker")
        fireEvent.change(inputExpenseDate, { target: { value : inputData.date } })
        expect(inputExpenseDate.value).toBe(inputData.date)

        const inputExpenseAmount = screen.getByTestId("amount")
        fireEvent.change(inputExpenseAmount, { target: { value : inputData.amount } })
        expect(parseInt(inputExpenseAmount.value)).toBe(inputData.amount)

        const inputExpenseVAT = screen.getByTestId("vat")
        fireEvent.change(inputExpenseVAT, { target: { value : inputData.vat } })
        expect(inputExpenseVAT.value).toBe(inputData.vat)

        const inputExpensePCT = screen.getByTestId("pct")
        fireEvent.change(inputExpensePCT, { target: { value : inputData.pct } })
        expect(parseInt(inputExpensePCT.value)).toBe(inputData.pct)

        const inputExpenseCommentary = screen.getByTestId("commentary")
        fireEvent.change(inputExpenseCommentary, { target: { value : inputData.commentary } })
        expect(inputExpenseCommentary.value).toBe(inputData.commentary)

        const inputExpenseFile = screen.getByTestId("file")
        // On crée un fichier de test et on l'upload dans l'input
        const testImageFile = new File(['test'], 'test.pdf', { type : 'application/pdf'})
        await userEvent.upload(inputExpenseFile, testImageFile)
        expect(inputExpenseFile.value).toBe("")

        const handleSubmit = jest.fn(newbill.handleSubmit)
        form.addEventListener("submit", handleSubmit)
        fireEvent.submit(form)
      })

      test("Then it should not renders Bills page", () => {
        expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
      })
    })

  })
})
