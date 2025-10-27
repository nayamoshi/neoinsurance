'use client';

import { useState, useEffect } from 'react';
import { EvmPriceServiceConnection } from '@pythnetwork/price-service-client';

const PYTH_PRICE_SERVICE_URL = 'https://hermes.pyth.network/v2';
const ARBITRUM_PYTH_CONTRACT_ADDRESS = '0xff1a0f4744e8582DF1aE09D5611b887B6a12925C';

const priceIds = {
  // You can find asset price IDs here: https://pyth.network/price-feeds
  PYUSD: '0x011b73919e585c3496923b44b1c313137e40b3c64c742ebd3c1626c7100b70c3', 
  ETH: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  ARB: '0x3fa4252848f9f0a1480be62b45fd3d65337e352516a347ad56f5af84379e39e1',
};

const connection = new EvmPriceServiceConnection(PYTH_PRICE_SERVICE_URL);

export const usePyth = () => {
  const [prices, setPrices] = useState<Record<string, number | undefined>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsLoading(true);
        const priceFeeds = await connection.getLatestPriceFeeds(Object.values(priceIds));
        
        if (priceFeeds) {
            const newPrices: Record<string, number> = {};
            
            for (const priceFeed of priceFeeds) {
                const price = priceFeed.getPriceNoOlderThan(60); // Get price if not older than 60 seconds
                if (price) {
                    const asset = Object.keys(priceIds).find(key => priceIds[key as keyof typeof priceIds] === priceFeed.id);
                    if (asset) {
                        newPrices[asset] = parseFloat(price.getPriceAsNumber().toFixed(2));
                    }
                }
            }
            setPrices(newPrices);
        }
      } catch (error) {
        console.error('Failed to fetch Pyth prices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return { prices, isLoading };
};
