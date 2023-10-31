import type { Circus } from '@jest/types';
import { TestEnvironment } from 'jest-environment-node';

// see for JS solution: https://github.com/jestjs/jest/issues/6527#issuecomment-760092817
// see for TS adaptation: https://github.com/jestjs/jest/issues/6527#issuecomment-1463950981
class FailFastEnvironment extends TestEnvironment {
  failedTest = false;

  async handleTestEvent(event: Circus.Event, state: Circus.State): Promise<void> {
    if (event.name === 'hook_failure' || event.name === 'test_fn_failure') {
      this.failedTest = true;
    } else if (this.failedTest && event.name === 'test_start') {
      event.test.mode = 'skip';
    }

    this.visualFeedback(event);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (super.handleTestEvent) await super.handleTestEvent(event, state);
  }

  private visualFeedback(event: Circus.Event) {
    switch (event.name) {
      case 'hook_failure':
        console.log(`[FAIL] Hook failure`);
        break;
      case 'test_fn_failure':
        console.log(`[FAIL] ${event.test.name}`);
        break;
      case 'test_start':
        if (this.failedTest) console.log(`[SKIP] ${event.test.name}`);
        break;
      case 'test_fn_success':
        console.log(`[ OK ] ${event.test.name}`);
        break;
    }
  }
}

export default FailFastEnvironment;
