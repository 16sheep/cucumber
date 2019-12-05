import { messages } from 'cucumber-messages'
import { Expression, CucumberExpression, RegularExpression } from 'cucumber-expressions'
import uuidv4 from 'uuid/v4'

import ISupportCodeExecutor from './ISupportCodeExecutor'
import ICucumberSupportCode from './ICucumberSupportCode'
import Hook from './Hook'

export default class CucumberSupportCode implements ICucumberSupportCode {
  private beforeHooks: Hook[] = []
  private afterHooks: Hook[] = []
  private hookById: { [key: string]: Hook } = {}

  public registerBeforeHook(
    tagExpression: string,
    executor: ISupportCodeExecutor
  ): messages.IHook {
    return this.registerHook(this.beforeHooks, tagExpression, executor)
  }

  public registerAfterHook(
    tagExpression: string,
    executor: ISupportCodeExecutor
  ): messages.IHook {
    return this.registerHook(this.afterHooks, tagExpression, executor)
  }

  private registerHook(
    storage: Hook[],
    tagExpression: string,
    executor: ISupportCodeExecutor
  ): messages.IHook {
    const hook = new Hook(tagExpression, executor)
    storage.push(hook)
    this.hookById[hook.id] = hook

    return new messages.Hook({
      id: hook.id,
      tagExpression,
    })
  }

  public registerStepDefinition(
    expression: Expression,
    executor: ISupportCodeExecutor
  ): messages.IStepDefinition {
    return new messages.StepDefinition({
      id: uuidv4(),
      pattern: new messages.StepDefinitionPattern({
        source: expression.source,
        type: this.expressionType(expression)
      })
    })
  }

  private expressionType(expression: Expression): messages.StepDefinitionPatternType {
    if (expression instanceof CucumberExpression) {
      return messages.StepDefinitionPatternType.CUCUMBER_EXPRESSION
    } else if (expression instanceof RegularExpression) {
      return messages.StepDefinitionPatternType.REGULAR_EXPRESSION
    } else {
      throw new Error(
        `Unknown expression type: ${expression.constructor.name}`
      )
    }
  }

  public findBeforeHooks(tags: string[]): string[] {
    return this.findHooks(tags, this.beforeHooks)
  }

  public findAfterHooks(tags: string[]): string[] {
    return this.findHooks(tags, this.afterHooks)
  }

  private findHooks(tags: string[], hooks: Hook[]): string[] {
    return hooks
      .map(hook => (hook.match(tags) ? hook.id : undefined))
      .filter(hookId => hookId !== undefined)
  }

  public executeHook(hookId: string): messages.ITestResult {
    const hook = this.hookById[hookId]
    if (hook === undefined) {
      throw new Error('Hook not found')
    }

    try {
      hook.execute()

      return new messages.TestResult({
        status: messages.TestResult.Status.PASSED,
      })
    } catch (error) {
      return new messages.TestResult({
        status: messages.TestResult.Status.FAILED,
        message: error.stack,
      })
    }
  }
}
