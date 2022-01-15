import { Work } from "../../src/work/Wokr";
import { suite, test } from "@testdeck/mocha";
import * as _chai from "chai";
import { expect } from "chai";

_chai.should();
_chai.expect;

@suite
class WorkModuleTest {
  private SUT: Work;
  private startDate: Date;
  private longDateDiff: Date;
  private shortDateDiff: Date;

  before() {
    this.startDate = new Date("December 17, 2007 12:30:30");
    this.shortDateDiff = new Date("December 17, 2007 15:50:40");
    this.longDateDiff = new Date("January 4, 2009 21:43:27");
    this.longDateDiff = new Date("January 4, 2009 21:43:27");

    this.SUT = new Work(this.startDate);
  }

  @test "Work is created"() {
    this.SUT.startDate.should.to.not.be.undefined.and.have
      .property("startDate")
      .equal(this.startDate);
  }

  @test "Work return short start date as a string"() {
    const wokrStartDate = this.SUT.getDateString(this.shortDateDiff);
    expect(wokrStartDate).to.be.equal("12:30");
  }

  @test "Work return long start date as a string"() {
    const wokrStartDate = this.SUT.getDateString(this.longDateDiff);
    expect(wokrStartDate).to.be.equal("17.11.2007 12:30");
  }

  @test "Work return long diff date as a string"() {
    expect(
      this.SUT.getDateDiff(new Date("January 4, 2009 21:43:27"))
    ).to.be.equal("1 year\nWell done!");

    expect(
      this.SUT.getDateDiff(new Date("January 4, 2010 21:43:27"))
    ).to.be.equal("2 years\nWell done!");

    expect(
      this.SUT.getDateDiff(new Date("November 17, 2008 12:30:30"))
    ).to.be.equal("336 days\nWell done!");

    expect(
      this.SUT.getDateDiff(new Date("December 17, 2009 12:30:30"))
    ).to.be.equal("2 years\nWell done!");
  }

  @test "Work return short diff date as a string"() {
    expect(
      this.SUT.getDateDiff(new Date("December 17, 2007 13:40:30"))
    ).to.be.equal("1 hour\nWell...");
    expect(
      this.SUT.getDateDiff(new Date("December 17, 2007 16:40:30"))
    ).to.be.equal("4 hours\nWell done!");

    expect(
      this.SUT.getDateDiff(new Date("December 17, 2007 12:31:30"))
    ).to.be.equal("1 minute\nWell...");

    expect(
      this.SUT.getDateDiff(new Date("December 17, 2007 12:33:40"))
    ).to.be.equal("3 minuts\nWell...");

    expect(
      this.SUT.getDateDiff(new Date("December 17, 2007 12:30:31"))
    ).to.be.equal("1 second\nWell...");

    expect(
      this.SUT.getDateDiff(new Date("December 17, 2007 12:30:35"))
    ).to.be.equal("5 seconds\nWell...");
  }
}
