import { Test, TestingModule } from '@nestjs/testing';
import { ProduitController } from './produit.controller';
import { ProduitService } from './produit.service';
import { UpdateProduitDto } from './dto/update-produit.dto';

describe('ProduitController', () => {
  let controller: ProduitController;
  let service: ProduitService;

  const mockProduitService = {
    chercherProduits: jest.fn(),
    updateProduit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProduitController],
      providers: [{ provide: ProduitService, useValue: mockProduitService }],
    }).compile();

    controller = module.get<ProduitController>(ProduitController);
    service = module.get<ProduitService>(ProduitService);
  });

  it('should call chercherProduits with query params', async () => {
    const mockResult = [{ id: 1, nom: 'Pommes', categorie: 'Fruits' }];
    mockProduitService.chercherProduits.mockResolvedValue(mockResult);

    const result = await controller.findProduits('1', 'Pommes', 'Fruits');
    expect(result).toEqual(mockResult);
    expect(mockProduitService.chercherProduits).toHaveBeenCalledWith({
      id: 1,
      nom: 'Pommes',
      categorie: 'Fruits',
    });
  });

  it('should convert id string to number or undefined', async () => {
    await controller.findProduits(undefined, 'Test', undefined);
    expect(mockProduitService.chercherProduits).toHaveBeenCalledWith({
      id: undefined,
      nom: 'Test',
      categorie: undefined,
    });
  });

  it('should call updateProduit with correct params', async () => {
    const updateDto: UpdateProduitDto = {
      nom: 'Pommes bio',
      categorie: 'Fruits',
      prix: 1.49,
      description: 'Pomme rouge juteuse',
    };

    const mockResponse = {
      id: 1,
      ...updateDto,
    };

    mockProduitService.updateProduit.mockResolvedValue(mockResponse);

    const result = await controller.updateProduit(1, updateDto);

    expect(result).toEqual(mockResponse);
    expect(mockProduitService.updateProduit).toHaveBeenCalledWith(1, updateDto);
  });
});
