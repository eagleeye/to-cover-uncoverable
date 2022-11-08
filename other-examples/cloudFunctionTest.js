it(`should process data correctly`, async () => {
    const result = await controller(events);
    const kafkaMessages = await getNLastKafkaMessages(topic, events.length);

    expect(result).to.be.eql(expectedResult);

    expect(kafkaMessages).to.be.eql([{/*...*/}, {/*...*/}])
});

