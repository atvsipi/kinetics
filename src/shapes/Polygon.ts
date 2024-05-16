import {Shape} from './Shape';
import {ShapeType} from '../typings/Enums';

export class Polygon extends Shape {
    public type: ShapeType = ShapeType.Polygon;
}
