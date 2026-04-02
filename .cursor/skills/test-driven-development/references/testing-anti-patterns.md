# Testing anti-patterns

Short reference when adding mocks or test utilities:

- **Mock theater:** Asserting that a mock was called N times often tests the mock, not real behavior. Prefer assertions on outputs and observable effects of real (or thin-wrapper) code.
- **Test-only production API:** Avoid adding methods or exports to production modules solely so tests can reach internals. Prefer testing through the public surface or small test doubles injected at boundaries.
- **Blind mocks:** Mock only what you understand. If everything is mocked, the test stops proving the integration you care about.
