import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

const logStep = createStep(
  {
    name: "log-step",
  },
  function (input: any) {
    console.log("log-step", JSON.stringify(input, null, 2));

    return new StepResponse({
      status: "success",
      message: "Requested",
      input: input,
    });
  }
);

export { logStep };
