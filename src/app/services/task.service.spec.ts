import { of } from 'rxjs';
import { TaskService } from './task.service';

describe('TestService', () => {
  let service: TaskService;
  let httpClientSpy: any;
  let router: any;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    };
    service = new TaskService(httpClientSpy, router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test response of getTasks', () => {
    const url = `http://localhost:3000/api/task`;
    const res = {
      status: 'success',
      message: 'Tasks successfully fetched',
      result: {
        tasks: [],
        maxTasks: 2,
      },
    };
    jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(res));
    service.getTasks();
    expect(httpClientSpy.get).toBeCalledTimes(1);
    expect(httpClientSpy.get).toHaveBeenCalledWith(url);
  });
});
