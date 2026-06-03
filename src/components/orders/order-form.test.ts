import { describe, expect, it } from "vitest";

import {
  emptyOrderFormValues,
  getOrderFormFieldErrors,
} from "./order-form";

const validForm = {
  order_number: "OS-2026-0099",
  customer_name: "Maria Silva",
  customer_phone: "(11) 99988-7766",
  device: "Celular",
  brand: "Samsung",
  model: "Galaxy A54",
  reported_issue: "Tela não liga após queda",
};

describe("getOrderFormFieldErrors", () => {
  it("returns no errors for valid input", () => {
    expect(getOrderFormFieldErrors(validForm)).toEqual({});
  });

  it("returns field errors in pt-BR for invalid input", () => {
    const errors = getOrderFormFieldErrors({
      ...emptyOrderFormValues,
      customer_name: "A",
      customer_phone: "123",
      reported_issue: "abc",
    });

    expect(errors.customer_name).toBeTruthy();
    expect(errors.customer_phone).toBeTruthy();
    expect(errors.reported_issue).toBeTruthy();
    expect(errors.order_number).toBeTruthy();
  });

  it("maps duplicate-ready order number field", () => {
    const errors = getOrderFormFieldErrors({
      ...validForm,
      order_number: "",
    });

    expect(errors.order_number).toContain("OS");
  });
});
