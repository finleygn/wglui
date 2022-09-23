interface ISubscriber<T extends (...args: Parameters<T>) => any> {
  callback: T,
  priority: number,
}

abstract class Subscription<T extends (...args: Parameters<T>) => any> {
  private subscribers = new Array<ISubscriber<T>>();

  subscribe(callback: T, priority: number): ISubscriber<T> {
    const subscriber = {
      callback,
      priority,
    };
    this.subscribers.push(subscriber);
    this.subscribers.sort((a, b) => a.priority - b.priority);
    return subscriber;
  }

  unsubscribe(unsubscribe: ISubscriber<T>) {
    const index = this.subscribers.findIndex(v => v === unsubscribe);
    if(index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }

  protected broadcast(...values: Parameters<T>) {
    for (const subscriber of this.subscribers) {
      subscriber.callback(...values);
    }
  }
}

export default Subscription;