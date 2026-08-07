using System;
using AutoMapper;
using MassTransit;
using MongoDB.Entities;

namespace SearchService.Consumers;

public class AuctionUpdatedConsumer : IConsumer<Contracts.AuctionUpdated>
{
    private readonly IMapper _mapper;

    public AuctionUpdatedConsumer(IMapper mapper)
    {
        _mapper = mapper;
    }
    public async Task Consume(ConsumeContext<Contracts.AuctionUpdated> context)
    {
        Console.WriteLine("--> Consuming auction updated");
        var item = _mapper.Map<Models.Item>(context.Message);

        var result = await DB.Update<Models.Item>()
            .Match(a => a.ID == context.Message.Id)
            .ModifyOnly(x => new {
                x.Color,
                x.Make,
                x.Model,
                x.Year,
                x.Mileage
            }, item)
            .ExecuteAsync();

        if(!result.IsAcknowledged) 
            throw new MessageException(typeof(Contracts.AuctionUpdated), "Problem updating mongodb");
    }

}
