export class Work {
  public startDate: Date;

  constructor(date: Date = new Date()) {
    this.startDate = date;
  }

  public getDateString(current: Date = new Date()): string {
    let response = "";

    const year = this.startDate.getFullYear();
    const month = this.startDate.getMonth();
    const day = this.startDate.getUTCDate();

    if (
      current.getFullYear() > year ||
      current.getMonth() > month ||
      current.getUTCDate() > day
    ) {
      response += `${day}.${month}.${year} `;
    }

    response += `${this.startDate.getHours()}:${this.startDate.getMinutes()}`;

    return response;
  }

  public getDateDiff(current: Date = new Date()): string {
    const diffYears = this.calculateDateDiff(
      this.startDate,
      current,
      1000 * 60 * 60 * 24 * 365
    );
    const diffDays = this.calculateDateDiff(
      this.startDate,
      current,
      1000 * 60 * 60 * 24
    );
    const diffHours = this.calculateDateDiff(
      this.startDate,
      current,
      1000 * 60 * 60
    );
    const diffMinuts = this.calculateDateDiff(
      this.startDate,
      current,
      1000 * 60
    );
    const diffSeconds = this.calculateDateDiff(this.startDate, current, 1000);

    let response = "";

    if (diffYears) response += `${diffYears} year${diffYears > 1 ? "s" : ""}\n`;
    else if (diffDays)
      response += `${diffDays} day${diffDays > 1 ? "s" : ""}\n`;
    else if (diffHours)
      response += `${diffHours} hour${diffHours > 1 ? "s" : ""}\n`;
    else if (diffMinuts)
      response += `${diffMinuts} minut${diffMinuts > 1 ? "s" : "e"}\n`;
    else if (diffSeconds)
      response += `${diffSeconds} second${diffSeconds > 1 ? "s" : ""}\n`;

    response += diffHours > 3 ? "Well done!" : "Well...";

    return response;
  }

  private calculateDateDiff(
    start: Date,
    end: Date,
    dividen: number = 0
  ): number {
    return Math.floor((end.getTime() - start.getTime()) / dividen);
  }
}
