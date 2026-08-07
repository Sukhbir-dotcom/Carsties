using System;
using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace SearchService.Consumers;

public class AuctionCreatedConsumer : IConsumer<AuctionCreated>
{
    private readonly IMapper _mapper;
    public AuctionCreatedConsumer(IMapper mapper)
    {
        _mapper = mapper;
    }
    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        Console.WriteLine("--> Consuming AuctionCreated:" + context.Message.Id);
        var item = _mapper.Map<Models.Item>(context.Message);
        
        if (item.Model == "Foo") throw new Exception("Foo is not a valid model");

        await item.SaveAsync();
    }
}
